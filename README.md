# PrepAI: AI-Powered Interview Preparation Platform (Backend Core)

PrepAI is a production-grade SDE and HR interview preparation platform built with a high-performance MVC architecture, Repository pattern abstractions, and robust fallback layers to ensure 100% service uptime during development and staging environments.

---

## 🏗️ Architectural Overview (MVC + Repository Pattern)

```
                       ┌─────────────────────────┐
                       │   React + Vite Client   │
                       └────────────┬────────────┘
                                    │ HTTP / REST
                                    ▼
                       ┌─────────────────────────┐
                       │   Express API Routing   │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │    Security & Auth      │ (JWT / Role check)
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │     SDE Controllers     │ (MVC Entrypoint)
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │  Repository Abstraction │
                       └──────┬─────────────┬────┘
                              │             │
          [isPrismaActive]    │             │   [Fallback Mode]
          (DATABASE_URL set)  ▼             ▼   (Offline State)
                     ┌──────────────┐     ┌──────────────┐
                     │  Prisma ORM  │     │  File-Based  │
                     │ (Postgres)   │     │ (db.json S3) │
                     └──────────────┘     └──────────────┘
```

The system employs a strict **Repository Pattern** decoupled from database drivers. When a production database (`DATABASE_URL`) is supplied, it initializes **Prisma ORM**; otherwise, it activates a high-fidelity JSON filesystem persistence engine, safeguarding developer sandbox loops from crashing.

---

## 📂 Backend File & Folder Structures

```
.
├── prisma/
│   └── schema.prisma             # Complete, highly granular Postgres DB Schema
├── src/
│   └── server/
│       ├── config/
│       │   └── db.ts             # Smart DB initializer (Prisma vs local file handler)
│       ├── middlewares/
│       │   ├── auth.ts           # Bearer JWT validator & Role-based Access Controllers
│       │   └── error_handler.ts  # Centralized Sentry-friendly exception middleware
│       ├── repositories/
│       │   ├── db_fallback.ts    # JSON-based persistence fallback with deep indexing
│       │   ├── user_repository.ts
│       │   ├── company_repository.ts
│       │   ├── coding_repository.ts
│       │   ├── resume_repository.ts
│       │   ├── interview_repository.ts
│       │   └── analytics_repository.ts
│       ├── controllers/
│       │   ├── auth_controller.ts     # Register, Login, Refresh, Password Recovery
│       │   ├── user_controller.ts     # User Profiles & Education milestones
│       │   ├── company_controller.ts  # Companies metadata, eligibility, and hiring rounds
│       │   ├── coding_controller.ts   # SDE Sandboxes, runtime analytics, submissions
│       │   ├── resume_controller.ts   # ATS grade calculators & improvement suggestions
│       │   ├── interview_controller.ts# Mock transcription feeds and score synthesis
│       │   ├── analytics_controller.ts# Strengths/weaknesses, Leaderboards, progress trackers
│       │   └── utility_controller.ts  # Bookmarks, notes, reminders, notifications
│       └── routes/
│           └── api.ts            # Master Express API Router mounting all endpoints
├── Dockerfile                    # Multi-stage production container manifest
├── docker-compose.yml            # Multi-service production suite orchestrator (Postgres + Redis)
├── package.json                  # Script definitions and dependency trees
└── .env.example                  # Template configuration environment parameters
```

---

## 🛠️ Tech Stack Features

- **Node.js, Express.js & TypeScript**: Type-safe routing engine.
- **Prisma ORM**: Modern database mapping for PostgreSQL.
- **JWT & Role-Based Access Control**: Safe token refresh cycles and recruiter/admin guard boundaries.
- **Redis & BullMQ (Configured)**: Handles background reminder jobs and mock interview scheduling threads.
- **Helmet, CORS, and Rate Limiting**: Solid cross-origin protection.
- **Robust Error Handling**: Standard, consistent JSON error formats.

---

## 🚀 Local & Production Deployment Guides

### 1. Manual Setup
1. Clone the project files.
2. Initialize configurations:
   ```bash
   cp .env.example .env
   ```
3. Install base dependencies:
   ```bash
   npm install
   ```
4. Build the client and server assets:
   ```bash
   npm run build
   ```
5. Spin up the server:
   ```bash
   npm run start
   ```

### 2. Docker Compose (Recommended)
Launch the API suite, PostgreSQL database, and Redis cache clusters automatically:
```bash
docker-compose up --build -d
```

---

## 📊 High-Granularity API Documentation

### 🔓 Authentication Endpoints
- **`POST /api/auth/register`**: Registers candidate profiles.
- **`POST /api/auth/login`**: Issues access/refresh JWT tokens.
- **`POST /api/auth/refresh`**: Generates fresh access tokens from refresh tokens.
- **`POST /api/auth/forgot-password`**: Triggers a password recovery link.
- **`POST /api/auth/google`**: Handles verified Google OAuth profiles.

### 💼 SDE & Recruiter Company Endpoints
- **`GET /api/companies`**: Retrieves companies with full-text search and filters.
- **`GET /api/companies/:id`**: Gets hiring process guidelines and interview rounds.
- **`POST /api/companies/:id/eligibility`**: Verifies if CGPA and branch parameters meet hiring criteria.

### 💻 Algorithmic Coding Endpoints
- **`GET /api/coding/questions`**: Fetches standard arrays, hashes, stack, and DP questions.
- **`POST /api/coding/submit`**: Compiles solutions and tracks runtime, memory, and code correctness.

### 📄 Intelligent Resume & ATS Endpoints
- **`POST /api/ai/resume`**: Parses PDFs, calculates ATS scores, identifies missing keywords, and recommends edits.
- **`GET /api/user/resume`**: Retrieves the latest parsed resume scores.

### 🎙️ SDE & HR Mock Interview Endpoints
- **`POST /api/interviews/session`**: Spawns mock interview sessions.
- **`POST /api/ai/simulate`**: Conducts interactive technical dialogues and feeds performance transcripts.

### 🏆 Analytics & Leaderboard Endpoints
- **`GET /api/analytics/progress`**: Retrieves XP graphs, streak calendars, and weak areas.
- **`GET /api/analytics/leaderboard`**: Ranks campus competitors based on total experience metrics.
