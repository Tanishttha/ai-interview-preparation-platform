from fastapi import APIRouter, HTTPException, status
from ai_microservice.app.models.resume import (
    ResumeParseRequest,
    ResumeParseResponse,
    CompanyEligibilityRequest,
    CompanyEligibilityResponse
)
from ai_microservice.app.services.ats_service import ats_service
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("routers.resume")
router = APIRouter()

@router.post("/resume/parse", response_model=ResumeParseResponse)
async def parse_resume_endpoint(payload: ResumeParseRequest):
    """
    Parses resume texts, calculates ATS scores, identifies missing keyword matrices,
    and returns rich recommendations.
    """
    logger.info("Received request for resume parsing & ATS score analysis.")
    try:
        parsed_result = ats_service.parse_resume(payload.resume_text, payload.job_description)
        return parsed_result
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse resume: {str(e)}"
        )

@router.post("/company/eligibility", response_model=CompanyEligibilityResponse)
async def check_eligibility_endpoint(payload: CompanyEligibilityRequest):
    """
    Runs smart criteria matching and screening prediction on CGPA, branches, and skill overlaps.
    """
    logger.info(f"Received screening check for Target Company ID: {payload.target_company_id}")
    
    # 1. Procedural cutoff logic matching elite company profiles (E.g. GPA >= 8.0, Tech Branch)
    branch_normalized = payload.branch.upper().strip()
    is_tech_branch = any(t in branch_normalized for t in ["CSE", "IT", "SWE", "ECE", "COMPUTER", "SOFTWARE"])
    
    eligible = True
    reasoning_bullets = []

    if payload.cgpa < 7.5:
        eligible = False
        reasoning_bullets.append(f"CGPA is {payload.cgpa}, which is below the threshold for premium company brackets (typically 7.5+ or 8.0+).")
    else:
        reasoning_bullets.append(f"CGPA {payload.cgpa} meets or exceeds standard entry criteria.")

    if not is_tech_branch:
        # Non-tech branch has stiffer matching, but eligible if skills overlap is huge
        reasoning_bullets.append(f"Candidate belongs to '{payload.branch}' (non-traditional CS stream). Screening relies heavily on demonstrable project skills.")
    
    # Calculate skill match index
    required_screening_skills = ["data structures", "algorithms", "system design", "database", "sql"]
    overlap_count = sum(1 for rs in required_screening_skills if any(rs in s.lower() for s in payload.skills))
    
    skill_overlap_ratio = overlap_count / len(required_screening_skills)
    
    # 2. Probability prediction score
    base_prob = 0.5
    base_prob += (payload.cgpa - 7.0) * 0.15  # Scale with high GPA
    if is_tech_branch:
        base_prob += 0.15
    base_prob += skill_overlap_ratio * 0.20
    
    predicted_probability = max(min(round(base_prob, 2), 1.0), 0.05)

    if eligible:
        reasoning_bullets.append(f"Excellent overlap on core coding blocks. Screening likelihood predicted at {int(predicted_probability * 100)}%.")
    else:
        reasoning_bullets.append("We recommend taking refresher assessments to strengthen core algorithms foundations before applying.")

    return CompanyEligibilityResponse(
        eligible=eligible,
        predicted_probability=predicted_probability,
        reasoning=" ".join(reasoning_bullets)
    )
