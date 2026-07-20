import numpy as np
import psycopg2
from typing import List, Dict, Tuple, Any
from ai_microservice.config import settings
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("vector_service")

class VectorService:
    def __init__(self):
        self._model = None
        self.db_url = settings.DATABASE_URL
        self.pg_available = False
        
        # Check if database is accessible and pgvector can be used
        try:
            conn = psycopg2.connect(self.db_url, connect_timeout=3)
            with conn.cursor() as cur:
                # Check for pgvector extension
                cur.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
                if cur.fetchone():
                    self.pg_available = True
                    logger.info("Postgres database is online and pgvector extension is available.")
                else:
                    logger.warning("Postgres is available, but 'pgvector' extension is missing. Run schema migration.")
            conn.close()
        except Exception as e:
            logger.warning(f"Database pgvector not active ({str(e)}). Falling back to high-performance in-memory vector storage.")

        # In-memory document & embedding cache for RAG fallback
        self._memory_store: List[Dict[str, Any]] = []

    @property
    def model(self):
        """Lazy-loads the SentenceTransformer model to keep server startup fast and lightweight."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading SentenceTransformer embedding model: {settings.EMBEDDING_MODEL_NAME}...")
                self._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
                logger.info("SentenceTransformer model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load sentence_transformers: {str(e)}. Falling back to lightweight TF-IDF simulation.")
                self._model = "fallback"
        return self._model

    def get_embedding(self, text: str) -> List[float]:
        """Generates embedding vector for a given text segment."""
        model_instance = self.model
        if model_instance == "fallback" or model_instance is None:
            # High-fidelity numeric hash vector of length 384 for fallback compatibility
            char_counts = [0] * 384
            for idx, char in enumerate(text[:1000]):
                char_counts[ord(char) % 384] += 1
            # Normalize vector
            norm = np.linalg.norm(char_counts) or 1.0
            return (np.array(char_counts) / norm).tolist()
        
        try:
            vector = model_instance.encode(text)
            return vector.tolist()
        except Exception as e:
            logger.error(f"Failed to generate embedding: {str(e)}")
            return [0.0] * 384

    def add_document(self, doc_id: str, content: str, metadata: dict = None) -> bool:
        """Saves a document and its embedding vector to pgvector or in-memory fallback store."""
        embedding = self.get_embedding(content)
        metadata_json = metadata or {}

        if self.pg_available:
            try:
                conn = psycopg2.connect(self.db_url)
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO documents (id, content, embedding, metadata)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding, metadata = EXCLUDED.metadata;
                        """,
                        (doc_id, content, embedding, psycopg2.extras.Json(metadata_json))
                    )
                conn.commit()
                conn.close()
                return True
            except Exception as e:
                logger.error(f"Failed to insert doc into pgvector: {str(e)}")

        # Fallback in-memory insertion
        self._memory_store = [d for d in self._memory_store if d["id"] != doc_id]
        self._memory_store.append({
            "id": doc_id,
            "content": content,
            "embedding": embedding,
            "metadata": metadata_json
        })
        return True

    def semantic_search(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Performs cosine-similarity semantic search using pgvector (if active) or in-memory cosine engine."""
        query_vector = self.get_embedding(query)

        if self.pg_available:
            try:
                conn = psycopg2.connect(self.db_url)
                with conn.cursor() as cur:
                    # Using pgvector distance operator <=> (cosine distance)
                    cur.execute(
                        """
                        SELECT id, content, metadata, (embedding <=> %s::vector) as distance
                        FROM documents
                        ORDER BY distance ASC
                        LIMIT %s;
                        """,
                        (query_vector, limit)
                    )
                    results = cur.fetchall()
                conn.close()
                return [
                    {"id": r[0], "content": r[1], "metadata": r[2], "similarity_score": 1.0 - float(r[3])}
                    for r in results
                ]
            except Exception as e:
                logger.error(f"pgvector query failed: {str(e)}. Falling back to memory search.")

        # In-memory cosine calculation
        scored_docs = []
        q_vec = np.array(query_vector)
        for doc in self._memory_store:
            doc_vec = np.array(doc["embedding"])
            dot_product = np.dot(q_vec, doc_vec)
            norm_q = np.linalg.norm(q_vec) or 1.0
            norm_doc = np.linalg.norm(doc_vec) or 1.0
            similarity = float(dot_product / (norm_q * norm_doc))
            
            scored_docs.append({
                "id": doc["id"],
                "content": doc["content"],
                "metadata": doc["metadata"],
                "similarity_score": similarity
            })
        
        # Sort desc by score
        scored_docs.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_docs[:limit]

vector_service = VectorService()
