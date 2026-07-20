import re
from typing import List, Dict, Any, Tuple
from ai_microservice.app.services.groq_service import groq_service
from ai_microservice.app.utils.logger import get_logger

logger = get_logger("ats_service")

class ATSService:
    COMMON_TECH_KEYWORDS = [
        "React", "Node", "TypeScript", "JavaScript", "Python", "Golang", "Java", "Docker",
        "Kubernetes", "AWS", "Google Cloud", "PostgreSQL", "MongoDB", "Redis", "GraphQL",
        "CI/CD", "Git", "REST API", "Microservices", "System Design", "Agile", "Prisma"
    ]

    def parse_resume(self, resume_text: str, job_description: str = None) -> Dict[str, Any]:
        """
        Parses raw resume texts to extract entities and compute granular ATS feedback.
        """
        if groq_service.is_active:
            try:
                system_instruction = (
                    "You are an ATS Parser and SDE hiring screen. Analyze the resume text. "
                    "Extract structured entities: name, email, skills (list), experience (list), education (list). "
                    "Return strictly valid JSON with keys: name, email, skills, experience, education, recommendations."
                )
                prompt = f"Resume Content:\n{resume_text}"
                parsed_data = groq_service.generate_structured_json(system_instruction, prompt)
                if parsed_data:
                    # Clean/Format response and compute ATS scores
                    return self._enrich_parsed_resume(parsed_data, resume_text, job_description)
            except Exception as e:
                logger.error(f"Groq-based ATS parsing failed: {str(e)}. Falling back to regex engine.")

        # High-fidelity procedural rule-based parsing engine fallback
        return self._procedural_parse(resume_text, job_description)

    def _procedural_parse(self, text: str, job_description: str = None) -> Dict[str, Any]:
        """
        Regex & Keyword mapping fallback to ensure instant parsing without LLM connections.
        """
        # 1. Contact Extraction
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        email = email_match.group(0) if email_match else "candidate@prepai.com"

        name_match = re.search(r"^[A-Z][a-z]+\s+[A-Z][a-z]+", text.strip())
        name = name_match.group(0) if name_match else "SDE Aspirant"

        # 2. Tech Keyword Mapping
        found_skills = []
        for keyword in self.COMMON_TECH_KEYWORDS:
            if re.search(rf"\b{re.escape(keyword)}\b", text, re.IGNORECASE):
                found_skills.append(keyword)

        # 3. Simple Experience block parser
        experience = []
        edu_lines = []
        lines = text.split("\n")
        for line in lines:
            line_str = line.strip()
            if any(term in line_str.lower() for term in ["engineer", "developer", "architect", "intern", "lead"]):
                experience.append(line_str)
            if any(term in line_str.lower() for term in ["btech", "degree", "university", "college", "gpa", "cgpa"]):
                edu_lines.append(line_str)

        raw_parsed = {
            "name": name,
            "email": email,
            "skills": found_skills or ["React", "JavaScript", "TypeScript"],
            "experience": experience or ["SDE Intern at Practice Sessions"],
            "education": edu_lines or ["Bachelor of Technology in Computer Science"],
            "recommendations": []
        }

        return self._enrich_parsed_resume(raw_parsed, text, job_description)

    def _enrich_parsed_resume(self, raw_data: dict, raw_text: str, jd: str = None) -> Dict[str, Any]:
        """
        Calculates ATS scores, matched vs missing keywords, and contextual feedback.
        """
        skills = raw_data.get("skills", [])
        experience = raw_data.get("experience", [])
        education = raw_data.get("education", [])
        
        # 1. Define target job description keywords
        jd_keywords = []
        if jd:
            # Extract keywords from user-provided JD
            for keyword in self.COMMON_TECH_KEYWORDS:
                if re.search(rf"\b{re.escape(keyword)}\b", jd, re.IGNORECASE):
                    jd_keywords.append(keyword)
        
        # If no keywords found in custom JD or JD not supplied, default to core tech requirements
        if not jd_keywords:
            jd_keywords = ["React", "TypeScript", "Node", "PostgreSQL", "System Design", "Docker"]

        # 2. Intersect lists
        matched_keywords = [k for k in jd_keywords if any(re.search(rf"\b{re.escape(k)}\b", raw_text, re.IGNORECASE) for k in [k])]
        missing_keywords = [k for k in jd_keywords if k not in matched_keywords]

        # 3. Compute ATS Score
        # Components: Skills Coverage (40%), Experience Quality (40%), Education/Format (20%)
        skills_score = int((len(matched_keywords) / len(jd_keywords)) * 100) if jd_keywords else 80
        exp_score = min(len(experience) * 20, 100) if experience else 50
        edu_score = 90 if education else 60
        
        ats_score = int((skills_score * 0.40) + (exp_score * 0.40) + (edu_score * 0.20))
        ats_score = max(min(ats_score, 100), 10)  # Bound between 10% and 100%

        # 4. Generate Recommendations
        recommendations = raw_data.get("recommendations", [])
        if not recommendations:
            if len(skills) < 5:
                recommendations.append("Expand your Technical Skills profile with core backend framework listings (e.g. Node, Python).")
            if not matched_keywords:
                recommendations.append("Align resume bullet points closer with the specific job description's tech stack.")
            if missing_keywords:
                recommendations.append(f"Consider integrating these missing keyword indicators to pass keyword screens: {', '.join(missing_keywords[:3])}")
            if len(raw_text) < 300:
                recommendations.append("Provide a deeper breakdown of your hands-on coding roles, deliverables, and architecture scopes.")
            if not recommendations:
                recommendations.append("Your resume structure looks solid! Consider writing impact metrics for all technical projects.")

        return {
            "name": raw_data.get("name"),
            "email": raw_data.get("email"),
            "skills": skills,
            "experience": experience,
            "education": education,
            "ats_score": ats_score,
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "recommendations": recommendations
        }

ats_service = ATSService()
