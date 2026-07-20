import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "PrepAI-AI-Microservice"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # API Keys & Third-Party Services
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "mock_groq_key_for_dev")
    WHISPER_MODEL: str = "whisper-1"  # Or we can use Groq's whisper-large-v3
    
    # Judge0 API
    JUDGE0_API_URL: str = os.getenv("JUDGE0_API_URL", "https://judge0-extra-ordinary.p.rapidapi.com")
    JUDGE0_API_KEY: str = os.getenv("JUDGE0_API_KEY", "mock_judge0_key")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres_secure_pass_999@localhost:5432/prepai")

    # Vector Embedding Model
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
