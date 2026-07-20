from fastapi import APIRouter, HTTPException, status
from typing import List

from ai_microservice.app.models.coach import (
    CoachChatRequest,
    CoachChatResponse,
    JobRecommendationRequest,
    JobRecommendationResponse,
    JobRecommendation,
    DailyChallengeRequest,
    DailyChallengeResponse
)
from ai_microservice.app.services.groq_service import groq_service
from ai_microservice.app.services.vector_service import vector_service
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("routers.coach")
router = APIRouter()

@router.post("/coach/chat", response_model=CoachChatResponse)
async def coach_chat_endpoint(payload: CoachChatRequest):
    """
    Core AI Career Coach conversational agent. Utilizes a hybrid RAG retrieval pipeline from vector databases
    and keeps conversation memory of previous exchanges.
    """
    logger.info(f"Coach Agent processing user query: '{payload.message[:50]}...'")
    
    # 1. RAG Retrieve Step
    # Query vector DB to fetch relevant context guidelines (SDE hiring rules, study sheets, company rounds)
    context_chunks = []
    try:
        search_results = vector_service.semantic_search(payload.message, limit=2)
        for res in search_results:
            if res.get("similarity_score", 0.0) >= 0.35:
                context_chunks.append(res.get("content", ""))
    except Exception as e:
        logger.warning(f"RAG semantic search bypassed: {str(e)}")

    rag_context = "\n".join(context_chunks) if context_chunks else "No specific vector background available."

    # 2. Reconstruct Conversation Memory Context
    formatted_history = []
    for msg in payload.history:
        formatted_history.append({"role": msg.role, "content": msg.content})

    # Append current message
    formatted_history.append({"role": "user", "content": payload.message})

    # 3. Construct System Prompt Template
    system_instruction = (
        "You are 'PrepAI Coach', a world-class Software Engineering (SDE) Career Mentor. "
        "Answer candidate queries on coding interviews, system design tradeoffs, salary negotiations, and resume guidelines. "
        "Utilize the supplementary context blocks provided below to offer grounded, accurate facts. "
        "Be inspiring, extremely professional, and structurally concise.\n\n"
        f"--- GROUNDED RAG BACKGROUND CONTEXT ---\n{rag_context}\n----------------------------------------\n\n"
        "Reply using clear Markdown with bullet points, code blocks where helpful, and actionable takeaways."
    )

    # 4. Generate Core Coach Response
    response_text = groq_service.generate_chat_response(
        system_instruction=system_instruction,
        messages=formatted_history
    )

    # 5. Formulate Suggested follow-up prompt choices
    suggested_follow_ups = [
        "How do I optimize my resume for ATS filters?",
        "What are the most common Dynamic Programming patterns in tech screens?",
        "Can you help me design a rate limiter in under 5 minutes?"
    ]

    return CoachChatResponse(
        response=response_text,
        suggested_follow_ups=suggested_follow_ups
    )

@router.post("/coach/recommend-jobs", response_model=JobRecommendationResponse)
async def recommend_jobs_endpoint(payload: JobRecommendationRequest):
    """
    Recommends SDE and product roles based on candidate skills, experience parameters, and fit logic.
    """
    logger.info("Computing job matches and role recommendations.")
    
    skills_lower = [s.lower() for s in payload.skills]
    
    # Simple semantic rule matching database
    all_mock_jobs = [
        JobRecommendation(
            job_title="Associate Backend Engineer",
            company_name="Stripe",
            match_score=85 if "node" in skills_lower or "postgresql" in skills_lower else 60,
            key_requirements=["Node.js", "PostgreSQL", "REST APIs", "Redis"],
            why_recommended="Strong match with your backend technologies list and transactional data models knowledge."
        ),
        JobRecommendation(
            job_title="Frontend Developer",
            company_name="Vercel",
            match_score=90 if "react" in skills_lower or "typescript" in skills_lower else 50,
            key_requirements=["React", "TypeScript", "Tailwind CSS", "Next.js"],
            why_recommended="Perfect align with frontend layout tools. High score based on user interface state management projects."
        ),
        JobRecommendation(
            job_title="Full-Stack Engineer",
            company_name="Linear",
            match_score=80 if len(skills_lower) >= 4 else 60,
            key_requirements=["React", "Node", "PostgreSQL", "TypeScript"],
            why_recommended="Broad full-stack profile matching client side states to relational database models."
        )
    ]

    # Filter/Sort by match score
    recommendations = sorted(all_mock_jobs, key=lambda x: x.match_score, reverse=True)

    return JobRecommendationResponse(recommendations=recommendations)

@router.post("/coach/daily-challenge", response_model=DailyChallengeResponse)
async def daily_challenge_endpoint(payload: DailyChallengeRequest):
    """
    Generates specialized daily coding or system design challenges based on user profile context.
    """
    logger.info("Generating daily challenges based on candidate profile.")
    
    if groq_service.is_active:
        try:
            system_instruction = (
                "You are an SDE Problem Writer. Formulate a challenging coding task or system design scenario. "
                "Return strictly valid JSON with keys: title, description, difficulty, starter_code."
            )
            prompt = f"Write a specialized problem for: {payload.target_role}. Skills: {', '.join(payload.user_skills)}"
            data = groq_service.generate_structured_json(system_instruction, prompt)
            if data and "title" in data:
                return DailyChallengeResponse(**data)
        except Exception as e:
            logger.error(f"Groq daily challenge failed: {str(e)}")

    # High fidelity logical procedural fallback
    title = "Implement Sliding Window Maximum"
    description = (
        "### Problem Statement\n\n"
        "You are given an array of integers `nums`, there is a sliding window of size `k` "
        "which is moving from the very left of the array to the very right. You can only see the `k` "
        "numbers in the window. Each time the sliding window moves right by one position.\n\n"
        "Return the max sliding window element array.\n\n"
        "**Example 1**:\n"
        "```\n"
        "Input: nums = [1,3,-1,-3,5,3,6,7], k = 3\n"
        "Output: [3,3,5,5,6,7]\n"
        "```"
    )
    starter_code = (
        "class Solution:\n"
        "    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:\n"
        "        # Implement your O(N) solution using a deque container\n"
        "        pass"
    )

    return DailyChallengeResponse(
        title=title,
        description=description,
        difficulty="Hard",
        starter_code=starter_code
    )
