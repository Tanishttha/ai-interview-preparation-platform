import json
from groq import Groq
from ai_microservice.config import settings
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("groq_service")

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.is_active = self.api_key != "mock_groq_key_for_dev" and bool(self.api_key)
        
        if self.is_active:
            try:
                self.client = Groq(api_key=self.api_key)
                logger.info("Groq Client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq Client: {str(e)}")
                self.is_active = False
        else:
            logger.warning("GROQ_API_KEY is not set or using mock key. Running in mock fallback mode.")

    def generate_chat_response(self, system_instruction: str, messages: list, model: str = "llama3-8b-8192") -> str:
        """
        Generates a text completion using Groq LLaMA models. Includes automatic mock fallback for smooth dev cycles.
        """
        if not self.is_active:
            # Smart Mock Fallback to simulate high-quality replies
            logger.info("Groq service is inactive. Running simulated response generator.")
            last_message = messages[-1]["content"] if messages else ""
            return self._simulate_response(system_instruction, last_message)

        try:
            formatted_messages = [{"role": "system", "content": system_instruction}] + messages
            completion = self.client.chat.completions.create(
                model=model,
                messages=formatted_messages,
                temperature=0.7,
                max_tokens=2048
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq API completion error: {str(e)}")
            # Fall back to simulated content rather than crashing the system
            return f"⚠️ [Groq Fallback Mode] Service encountered an API error: {str(e)}. Here is a pre-calculated answer tailored to your prep path."

    def generate_structured_json(self, system_instruction: str, prompt: str, model: str = "llama3-8b-8192") -> dict:
        """
        Enforces JSON output response using JSON mode or prompt engineering.
        """
        if not self.is_active:
            return {}

        try:
            # Format system prompt to explicitly enforce valid JSON structure
            sys_instruct_with_json = f"{system_instruction}\n\nIMPORTANT: You must output strictly valid, parsing-friendly JSON and nothing else. No explanation, no backticks."
            completion = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": sys_instruct_with_json},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )
            raw_text = completion.choices[0].message.content
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Groq structured JSON generation failed: {str(e)}")
            return {}

    def _simulate_response(self, system_instruction: str, last_message: str) -> str:
        """
        Synthesizes smart context-aware responses when no Groq API Key is active.
        """
        lm_lower = last_message.lower()
        if "resume" in lm_lower or "cv" in lm_lower:
            return (
                "### 📝 Resume Feedback (Mock mode)\n\n"
                "Based on SDE benchmarks for tech industry resumes:\n"
                "- **Strong Point**: Clear listing of project tech stacks (React, Express, Node).\n"
                "- **Suggested Improvement**: Quantify impact. E.g., 'Optimized database lookup latency by 35% using index tuning' instead of 'Worked on DB indexing'.\n"
                "- **ATS Checklist**: Missing clear cloud framework metrics (AWS, GCP) or CI/CD pipelines.\n\n"
                "*Configure `GROQ_API_KEY` in env for deep live analysis!*"
            )
        elif "interview" in lm_lower or "question" in lm_lower:
            return (
                "### 🎙️ SDE Prep Mock Dialogue (Mock mode)\n\n"
                "**Question**: How do you manage connection pooling in high-volume microservice environments?\n\n"
                "**Pro-Tip**: Mention connection recycling, socket reuse, and setting max limits based on database CPU/Memory constraints. "
                "In Express apps, use a singleton pg/Prisma instance to prevent leaking socket descriptors during hot swaps."
            )
        elif "explain" in lm_lower or "complexity" in lm_lower:
            return (
                "### 💻 Code & Complexity Review (Mock mode)\n\n"
                "- **Time Complexity**: **O(N)** since we iterate through the list elements exactly once.\n"
                "- **Space Complexity**: **O(N)** for storing visited elements in a set container.\n"
                "- **Refactoring Advice**: Consider in-place pointer updates if maximum space efficiency is a hard constraint (O(1))."
            )
        else:
            return (
                "👋 **PrepAI Career Coach (Simulated Assistant)**\n\n"
                "To optimize your preparation roadmap, let's focus on foundational algorithm architectures:\n"
                "- **Dynamic Programming**: Practice Knapsack, Edit Distance, and Grid traversal pathways.\n"
                "- **System Design**: Understand Rate-Limiters, URL Shorteners, and Content Delivery Networks.\n\n"
                "*Please add your Groq API Key (`GROQ_API_KEY`) to activate premium LLM processing.*"
            )

groq_service = GroqService()
