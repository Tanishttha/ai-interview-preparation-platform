from fastapi import APIRouter, HTTPException, status
from typing import List
import json

from ai_microservice.app.models.interview import (
    QuestionGenerationRequest,
    QuestionGenerationResponse,
    InterviewQuestion,
    AdaptiveFollowUpRequest,
    AdaptiveFollowUpResponse,
    InterviewEvaluationRequest,
    InterviewEvaluationResponse
)
from ai_microservice.app.services.groq_service import groq_service
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("routers.interview")
router = APIRouter()

@router.post("/interview/generate", response_model=QuestionGenerationResponse)
async def generate_questions_endpoint(payload: QuestionGenerationRequest):
    """
    Generates professional SDE & HR interview questions, customizable by role, difficulty, topic, and resume skills.
    """
    logger.info(f"Generating questions for role: {payload.role}, topic: {payload.topic}")
    
    # 1. Active Groq path
    if groq_service.is_active:
        try:
            system_instruction = (
                "You are an Elite SDE Interviewer and Recruiter. Generate a list of standard, robust technical "
                "or situational interview questions with ideal suggested answers. Return strictly a JSON object "
                "with a single key 'questions' containing a list of objects with properties: id (string), question_text, category, suggested_answer."
            )
            prompt = (
                f"Generate 3 questions for target role: '{payload.role}' with difficulty: '{payload.difficulty}'. "
                f"Focus topic: '{payload.topic or 'General Software Engineering'}'. "
                f"Candidate's Resume Tech Stack: {', '.join(payload.resume_skills)}."
            )
            data = groq_service.generate_structured_json(system_instruction, prompt)
            if data and "questions" in data:
                return QuestionGenerationResponse(
                    questions=[InterviewQuestion(**q) for q in data["questions"]]
                )
        except Exception as e:
            logger.error(f"Failed to generate questions with Groq: {str(e)}")

    # 2. Complete, context-aware rule-based fallback
    logger.info("Executing mock/rules fallback for Interview Question generation.")
    topic_str = (payload.topic or "General Programming").lower()
    
    mock_questions = []
    if "tree" in topic_str or "graph" in topic_str:
        mock_questions = [
            InterviewQuestion(
                id="q_tree_1",
                question_text="How do you find the lowest common ancestor (LCA) of a binary tree in optimal time?",
                category="Coding (Trees)",
                suggested_answer="Traverse recursively from the root. If the current node matches either search target, return it. If left and right traversals both return nodes, the current node is the LCA."
            ),
            InterviewQuestion(
                id="q_tree_2",
                question_text="Explain the difference between DFS and BFS traversal with respect to memory complexity.",
                category="Algorithms",
                suggested_answer="DFS uses O(H) space for call stacks (H is tree height). BFS uses O(W) space for its queue (W is maximum tree width)."
            )
        ]
    elif "design" in topic_str or "system" in topic_str:
        mock_questions = [
            InterviewQuestion(
                id="q_sys_1",
                question_text="How would you design a scalable rate-limiting system for a high-traffic API gateway?",
                category="System Design",
                suggested_answer="Use Redis with a Token Bucket or Sliding Window Log algorithm. Set up cluster instances of Redis to coordinate across gateway machines."
            ),
            InterviewQuestion(
                id="q_sys_2",
                question_text="What are the main differences between relational SQL databases and NoSQL document stores with respect to consistency?",
                category="System Design",
                suggested_answer="SQL prioritizes ACID transaction consistency. NoSQL stores often trade immediate consistency for high availability, utilizing eventual consistency models (BASE)."
            )
        ]
    else:
        # Default tailored to candidate skills or role
        skills_str = ", ".join(payload.resume_skills[:3]) if payload.resume_skills else "modern web frameworks"
        mock_questions = [
            InterviewQuestion(
                id="q_general_1",
                question_text=f"How do you handle asynchronous state synchronization or state race-conditions in applications leveraging {skills_str}?",
                category="Software Engineering",
                suggested_answer="We can handle state race conditions using transaction locks, cancellation tokens, cleanups in hooks, or transactional databases depending on stack level."
            ),
            InterviewQuestion(
                id="q_general_2",
                question_text="Describe a scenario where you had to debug a severe memory leak or performance degradation in staging.",
                category="Behavioral / STAR",
                suggested_answer="Identify the profiling tools used (like Chrome DevTools or memory heap snapshots), isolate the root closure retention, and resolve it by cleaning listener bindings."
            )
        ]

    return QuestionGenerationResponse(questions=mock_questions)

@router.post("/interview/followup", response_model=AdaptiveFollowUpResponse)
async def adaptive_followup_endpoint(payload: AdaptiveFollowUpRequest):
    """
    Analyzes the user's latest response to formulate adaptive micro-feedback and a targeted follow-up question.
    """
    logger.info("Generating adaptive interview follow-up question.")
    
    if groq_service.is_active:
        try:
            system_instruction = (
                "You are an SDE hiring interviewer. Provide brief, encouraging but critical micro-feedback "
                "on the user's latest answer, and immediately formulate a deep-dive follow-up question. "
                "Return strictly valid JSON with keys: feedback, next_question."
            )
            # Reconstruct transcript conversation
            transcript_history = []
            for item in payload.history:
                transcript_history.append(f"{item.get('role', 'interviewer')}: {item.get('content', '')}")
            transcript_history.append(f"Candidate last answer: {payload.last_answer}")
            
            prompt = "\n".join(transcript_history)
            data = groq_service.generate_structured_json(system_instruction, prompt)
            if data and "feedback" in data and "next_question" in data:
                return AdaptiveFollowUpResponse(
                    feedback=data["feedback"],
                    next_question=data["next_question"]
                )
        except Exception as e:
            logger.error(f"Groq adaptive follow-up error: {str(e)}")

    # High fidelity logical simulation
    ans_lower = payload.last_answer.lower()
    if any(kw in ans_lower for kw in ["index", "db", "sql", "query", "cache"]):
        feedback = "Great focus on database efficiency and lookup strategies!"
        next_question = "How would you handle cache-invalidation or replication lag when adding a Redis layer on top of your primary store?"
    elif any(kw in ans_lower for kw in ["complexity", "big o", "space", "time"]):
        feedback = "Solid grasp of time-space tradeoffs."
        next_question = "Can you optimize this algorithm further to execute in-place to achieve O(1) auxiliary space complexity?"
    else:
        feedback = "Good start on detailing your implementation choice."
        next_question = "Could you walk me through the potential failure cases of this approach and how you would handle them in production?"

    return AdaptiveFollowUpResponse(feedback=feedback, next_question=next_question)

@router.post("/interview/evaluate", response_model=InterviewEvaluationResponse)
async def evaluate_interview_endpoint(payload: InterviewEvaluationRequest):
    """
    Analyzes complete interview dialogs to synthesize overall scores, strengths, weaknesses, hiring indices, and study recommendations.
    """
    logger.info(f"Synthesizing evaluation for {payload.interview_type} mock session.")
    
    if groq_service.is_active:
        try:
            system_instruction = (
                "You are an Expert Technical Interview Panelist. Analyze the interview transcript dialog "
                "and evaluate candidate performance. Return strictly a JSON object with properties: "
                "score (int 0-100), strengths (list), weaknesses (list), hiring_probability (float 0.0-1.0), "
                "readiness_level (string: 'Ready', 'Needs Practice', or 'Unprepared'), and actionable_suggestions (list)."
            )
            prompt = f"Role: {payload.target_role}\nTranscript:\n{json.dumps(payload.transcript)}"
            data = groq_service.generate_structured_json(system_instruction, prompt)
            if data and "score" in data:
                return InterviewEvaluationResponse(**data)
        except Exception as e:
            logger.error(f"Groq evaluation synthesis error: {str(e)}")

    # Analytical fallback based on simple transcript analysis
    num_exchanges = len(payload.transcript)
    total_words = sum(len(m.get("content", "")) for m in payload.transcript)
    
    score = 75
    strengths = ["Structured thought process", "Clear code reasoning"]
    weaknesses = ["Could quantify engineering outcomes more precisely"]
    readiness_level = "Needs Practice"
    hiring_probability = 0.65

    if total_words > 1500:
        score += 10
        strengths.append("Thorough and detailed explanations of architectural design choices")
    elif total_words < 400:
        score -= 15
        weaknesses.append("Answers were extremely short, leaving recruiters guessing about implementation details")
        readiness_level = "Unprepared"
        hiring_probability = 0.35

    if payload.interview_type.lower() == "hr":
        strengths.append("Conveys STAR methodology clearly (Situation, Task, Action, Result)")
    else:
        strengths.append("Strong understanding of data organization and Big O complexity constraints")

    hiring_probability = round(min(max(score / 100.0 - 0.05, 0.1), 0.98), 2)
    if score >= 85:
        readiness_level = "Ready"

    return InterviewEvaluationResponse(
        score=score,
        strengths=strengths,
        weaknesses=weaknesses,
        hiring_probability=hiring_probability,
        readiness_level=readiness_level,
        actionable_suggestions=[
            "Practice structuring complex coding reviews using comments to isolate logic modules.",
            "Quantify technical metrics (e.g., 'saved 40% memory', 'reduced server overhead by 20%') in STAR scenarios.",
            "Explain tradeoffs between memory and computation before jumping into implementation."
        ]
    )
