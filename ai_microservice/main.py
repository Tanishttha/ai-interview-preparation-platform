from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from ai_microservice.config import settings
from ai_microservice.app.utils.logger import get_logger

# Import router modules
from ai_microservice.app.routers.resume import router as resume_router
from ai_microservice.app.routers.interview import router as interview_router
from ai_microservice.app.routers.coding import router as coding_router
from ai_microservice.app.routers.analytics import router as analytics_router
from ai_microservice.app.routers.coach import router as coach_router

logger = get_logger("main")

app = FastAPI(
    title=settings.APP_NAME,
    description="Complete AI-Powered Core Microservice for Candidate Screening, Resume ATS, Coding Sandboxes, and Interview Prep.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom profiling and metrics middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} served in {process_time:.4f}s")
    return response

# Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global server error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal Microservice Error", "details": str(exc)},
    )

# Root Health Check
@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "database_url_configured": settings.DATABASE_URL != "",
        "groq_api_active": settings.GROQ_API_KEY != "mock_groq_key_for_dev"
    }

# Mount sub-routers with logical prefixes
app.include_router(resume_router, prefix="/api/ai", tags=["Resume & Eligibility"])
app.include_router(interview_router, prefix="/api/ai", tags=["Mock Interviews"])
app.include_router(coding_router, prefix="/api/ai", tags=["Algorithmic Coding"])
app.include_router(analytics_router, prefix="/api/ai", tags=["Prep Analytics & Roadmap"])
app.include_router(coach_router, prefix="/api/ai", tags=["Conversational Coaching"])

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
