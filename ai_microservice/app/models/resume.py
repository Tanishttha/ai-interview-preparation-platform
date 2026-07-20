from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ResumeParseRequest(BaseModel):
    resume_text: str = Field(..., description="Raw text content parsed from resume PDF/Word doc")
    job_description: Optional[str] = Field(None, description="Optional job description to match against")

class ResumeParseResponse(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    skills: List[str] = []
    experience: List[str] = []
    education: List[str] = []
    ats_score: int = Field(..., description="ATS compatibility score (0-100)")
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []
    recommendations: List[str] = []

class CompanyEligibilityRequest(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Candidate's CGPA")
    branch: str = Field(..., description="Academic branch (e.g., CSE, ECE)")
    skills: List[str] = Field(..., description="Candidate's listed skills")
    target_company_id: str = Field(..., description="Target company database ID or name")

class CompanyEligibilityResponse(BaseModel):
    eligible: bool = Field(..., description="Whether candidate satisfies core cutoffs")
    predicted_probability: float = Field(..., description="AI predicted probability of passing the screening")
    reasoning: str = Field(..., description="Brief feedback or logic for this outcome")
