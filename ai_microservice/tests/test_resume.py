import pytest
from fastapi.testclient import TestClient
from ai_microservice.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_resume_parsing_endpoint():
    payload = {
        "resume_text": "Mehak Sehgal\nEmail: mehak@example.com\nSkills: React, Node, PostgreSQL\nExperience: SDE Intern at Stripe\nEducation: BTech CSE",
        "job_description": "We are looking for a Software Engineer experienced in React, TypeScript, Node, and SQL."
    }
    response = client.post("/api/ai/resume/parse", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "ats_score" in data
    assert "skills" in data
    assert "matched_keywords" in data
    assert data["ats_score"] > 0

def test_company_eligibility_endpoint():
    payload = {
        "cgpa": 8.5,
        "branch": "CSE",
        "skills": ["Data Structures", "Algorithms", "React"],
        "target_company_id": "google"
    }
    response = client.post("/api/ai/company/eligibility", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "eligible" in data
    assert "predicted_probability" in data
    assert "reasoning" in data
    assert data["eligible"] is True
