from fastapi import APIRouter, HTTPException, status
from typing import List, Dict

from ai_microservice.app.models.coach import (
    WeakTopicDetectionRequest,
    WeakTopicResponse
)
from ai_microservice.app.services.groq_service import groq_service
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("routers.analytics")
router = APIRouter()

@router.post("/analytics/weak-topics", response_model=WeakTopicResponse)
async def analyze_weak_topics_endpoint(payload: WeakTopicDetectionRequest):
    """
    Scans historic interview logs, score levels, and coding submissions to map candidate skill strengths/weaknesses,
    and returns a personalized study roadmap.
    """
    logger.info("Scanning performance records to evaluate candidate strengths/weaknesses.")
    
    if groq_service.is_active:
        try:
            system_instruction = (
                "You are an SDE Study Plan Planner. Analyze past attempts and performance. "
                "Identify specific weak coding/interview topics, strong topics, and draft a short, highly "
                "actionable daily Study Plan. Return strictly valid JSON with keys: "
                "identified_weaknesses (list), strengths (list), study_plan (string)."
            )
            prompt = f"Past Performance Attempts Logs:\n{payload.past_attempts}"
            data = groq_service.generate_structured_json(system_instruction, prompt)
            if data and "identified_weaknesses" in data:
                return WeakTopicResponse(**data)
        except Exception as e:
            logger.error(f"Groq analytics calculation failed: {str(e)}")

    # Analytical fallback engine
    # Calculate averages per topic
    topic_scores: Dict[str, List[int]] = {}
    for attempt in payload.past_attempts:
        topic = attempt.get("topic", "General").title()
        try:
            score = int(attempt.get("score", "70"))
        except ValueError:
            score = 70
        topic_scores.setdefault(topic, []).append(score)

    strengths = []
    weaknesses = []

    for topic, scores in topic_scores.items():
        avg_score = sum(scores) / len(scores)
        if avg_score >= 80:
            strengths.append(topic)
        elif avg_score < 70:
            weaknesses.append(topic)

    # Defaults if data is scarce or even
    if not strengths:
        strengths = ["Arrays & Strings", "Basic Stack operations"]
    if not weaknesses:
        weaknesses = ["Dynamic Programming", "System Design Scalability"]

    study_plan = (
        "### 📅 7-Day Personalized Acceleration Study Plan\n\n"
        f"**Goal**: Master your primary weaknesses ({', '.join(weaknesses)})\n\n"
        "1. **Days 1-2 (Focus: Algorithms Foundations)**:\n"
        "   - Solve 3 standard problems in DFS/BFS recursive paths.\n"
        "   - Practice memorizing grid transitions to optimize bottom-up tabular computations.\n\n"
        "2. **Days 3-4 (Focus: Advanced System Design)**:\n"
        "   - Read architectural guides on CDN caching tiers and distributed sharding.\n"
        "   - Map microservice APIs using token rate limits with Redis databases.\n\n"
        "3. **Days 5-7 (Focus: Practical Simulation)**:\n"
        "   - Take a full HR + SDE Tech mock interview session on PrepAI.\n"
        "   - Act on review logs, targeting concise code optimization layouts."
    )

    return WeakTopicResponse(
        identified_weaknesses=weaknesses,
        strengths=strengths,
        study_plan=study_plan
    )
