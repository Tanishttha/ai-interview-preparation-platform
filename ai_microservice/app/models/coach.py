from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class CoachChatRequest(BaseModel):
    message: str = Field(..., description="Current user input query")
    history: List[ChatMessage] = Field(default=[], description="Chat conversation context")
    user_context: Optional[Dict[str, str]] = Field(default=None, description="Additional metadata about user like profile, target role")

class CoachChatResponse(BaseModel):
    response: str = Field(..., description="Coaching or chat response with formatted text")
    suggested_follow_ups: List[str] = Field(default=[], description="Auto-suggested follow-up queries")

class DailyChallengeRequest(BaseModel):
    target_role: str = Field("Software Engineer", description="Target job description/role")
    user_skills: List[str] = Field(default=[], description="User's listed skills")

class DailyChallengeResponse(BaseModel):
    title: str = Field(..., description="Title of today's challenge")
    description: str = Field(..., description="Markdown description of the challenge/coding problem")
    difficulty: str = Field(..., description="Easy/Medium/Hard")
    starter_code: str = Field(..., description="Starter skeleton code block")

class WeakTopicDetectionRequest(BaseModel):
    past_attempts: List[Dict[str, str]] = Field(..., description="Chronological record of past problem attempts/mock sessions")

class WeakTopicResponse(BaseModel):
    identified_weaknesses: List[str] = Field(..., description="Weak areas detected (e.g. Dynamic Programming)")
    strengths: List[str] = Field(..., description="Identified strong areas")
    study_plan: str = Field(..., description="Personalized study roadmap to cover the weaknesses")

class JobRecommendationRequest(BaseModel):
    skills: List[str] = Field(..., description="Candidate's skills")
    experience_level: str = Field("Junior", description="Experience level: Junior, Mid, Senior")
    preferred_role: Optional[str] = Field(None, description="Preferred role type")

class JobRecommendation(BaseModel):
    job_title: str
    company_name: str
    match_score: int = Field(..., description="Compatibility percentage (0-100)")
    key_requirements: List[str]
    why_recommended: str

class JobRecommendationResponse(BaseModel):
    recommendations: List[JobRecommendation]
