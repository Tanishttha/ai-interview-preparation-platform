from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class QuestionGenerationRequest(BaseModel):
    role: str = Field(..., description="Target SDE/HR role (e.g., 'Backend Engineer', 'Product Manager')")
    difficulty: str = Field("Medium", description="Difficulty level ('Easy', 'Medium', 'Hard')")
    topic: Optional[str] = Field(None, description="Specific topic like 'Trees', 'System Design'")
    resume_skills: List[str] = Field(default=[], description="Skills parsed from the candidate's resume for tailoring questions")

class InterviewQuestion(BaseModel):
    id: str
    question_text: str
    category: str
    suggested_answer: str

class QuestionGenerationResponse(BaseModel):
    questions: List[InterviewQuestion]

class AdaptiveFollowUpRequest(BaseModel):
    history: List[Dict[str, str]] = Field(..., description="Previous messages/questions & answers in sequence")
    last_answer: str = Field(..., description="The user's latest answer to follow up on")

class AdaptiveFollowUpResponse(BaseModel):
    feedback: str = Field(..., description="Micro feedback on the last answer")
    next_question: str = Field(..., description="Next adaptive follow-up question")

class InterviewEvaluationRequest(BaseModel):
    interview_type: str = Field("technical", description="Type of interview: 'technical' or 'hr'")
    transcript: List[Dict[str, str]] = Field(..., description="Entire interview dialog transcript")
    target_role: str = Field(..., description="Target position")

class InterviewEvaluationResponse(BaseModel):
    score: int = Field(..., description="Overall score out of 100")
    strengths: List[str] = []
    weaknesses: List[str] = []
    hiring_probability: float = Field(..., description="Hiring prediction probability (0.0 - 1.0)")
    readiness_level: str = Field(..., description="Readiness tier: 'Ready', 'Needs Practice', 'Unprepared'")
    actionable_suggestions: List[str] = []
