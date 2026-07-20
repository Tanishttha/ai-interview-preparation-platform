import { Router } from 'express';
import { UserController } from '../controllers/user_controller';
import { CompanyController } from '../controllers/company_controller';
import { CodingController } from '../controllers/coding_controller';
import { ResumeController } from '../controllers/resume_controller';
import { InterviewController } from '../controllers/interview_controller';
import { AnalyticsController } from '../controllers/analytics_controller';
import { UtilityController } from '../controllers/utility_controller';
import { ScraperController } from '../controllers/scraper_controller';
import { AIController } from '../controllers/ai_controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth';

const router = Router();

const userCtrl = new UserController();
const companyCtrl = new CompanyController();
const codingCtrl = new CodingController();
const resumeCtrl = new ResumeController();
const interviewCtrl = new InterviewController();
const analyticsCtrl = new AnalyticsController();
const utilityCtrl = new UtilityController();
const scraperCtrl = new ScraperController();
const aiCtrl = new AIController();

// 1. AUTHENTICATION
// Auth itself is handled client-side by Firebase Auth (src/lib/firebase.ts).
// The backend's job is only to verify the resulting ID token — see
// middlewares/auth.ts — and auto-provision/find the matching local user.
// There are no separate register/login/refresh endpoints: nothing to wire
// them to on the frontend, and keeping two parallel auth systems in sync
// is a liability, not a feature.

// 2. USER MODULE ROUTES
router.get('/user/profile', authenticateJWT, userCtrl.getProfile);
router.put('/user/profile', authenticateJWT, userCtrl.updateProfile);
router.get('/user/dashboard', authenticateJWT, userCtrl.getDashboardMetrics);

// 3. COMPANIES MODULE ROUTES
router.get('/companies', companyCtrl.listCompanies);
router.get('/companies/:id', companyCtrl.getCompanyDetails);
router.post('/companies/:id/eligibility', companyCtrl.checkEligibility);
router.post('/companies', authenticateJWT, authorizeRoles('ADMIN', 'RECRUITER'), companyCtrl.createCompany);

// 4. CODING MODULE ROUTES
router.get('/coding/questions', codingCtrl.listQuestions);
router.get('/coding/questions/:id', codingCtrl.getQuestion);
router.post('/coding/submit', authenticateJWT, codingCtrl.submitCode);

// 5. RESUME MODULE ROUTES
router.get('/auth/linkedin/url', resumeCtrl.getLinkedInUrl);
router.get('/auth/linkedin/callback', resumeCtrl.linkedinCallback);
router.post('/ai/resume', authenticateJWT, resumeCtrl.uploadResume);
router.post('/ai/resume/rewrite', authenticateJWT, resumeCtrl.rewriteResume);
router.post('/ai/resume/evaluate', authenticateJWT, resumeCtrl.evaluateJobMatch);
router.get('/user/resume', authenticateJWT, resumeCtrl.getLatestResume);
router.get('/user/resume/profile', authenticateJWT, resumeCtrl.getResumeProfile);
router.post('/user/resume/profile', authenticateJWT, resumeCtrl.saveResumeProfile);

// 6. INTERVIEW MODULE ROUTES
router.get('/interviews/history', authenticateJWT, interviewCtrl.getHistory);
router.post('/interviews/session', authenticateJWT, interviewCtrl.createInterviewSession);
router.post('/ai/simulate', authenticateJWT, interviewCtrl.simulateInterviewResponse);

// 7. ANALYTICS MODULE ROUTES
router.get('/analytics/progress', authenticateJWT, analyticsCtrl.getUserProgress);
router.get('/analytics/leaderboard', analyticsCtrl.getLeaderboard);

// 8. UTILITIES (Calendar, Notes, Bookmarks, Notifications)
router.get('/calendar', authenticateJWT, utilityCtrl.getCalendar);
router.post('/calendar', authenticateJWT, utilityCtrl.createCalendarEvent);

router.get('/notes', authenticateJWT, utilityCtrl.getNotes);
router.post('/notes', authenticateJWT, utilityCtrl.createNote);
router.put('/notes/:id', authenticateJWT, utilityCtrl.updateNote);
router.delete('/notes/:id', authenticateJWT, utilityCtrl.deleteNote);

router.get('/bookmarks', authenticateJWT, utilityCtrl.getBookmarks);
router.post('/bookmarks/toggle', authenticateJWT, utilityCtrl.toggleBookmark);

router.get('/notifications', authenticateJWT, utilityCtrl.getNotifications);
router.put('/notifications/:id/read', authenticateJWT, utilityCtrl.markNotificationRead);

// 9. RECRUITER & AI WEB SCRAPER
router.post('/ai/scrape', authenticateJWT, scraperCtrl.triggerScrape);
router.get('/ai/scrape/history', authenticateJWT, scraperCtrl.getScrapedHistory);

// 10. CORE AI SERVICES
router.post('/ai/chat', authenticateJWT, aiCtrl.chat);
router.post('/ai/coach', authenticateJWT, aiCtrl.coach);
router.post('/ai/roadmap', authenticateJWT, aiCtrl.generateRoadmap);
router.post('/ai/calendar/remind', authenticateJWT, aiCtrl.scheduleRemind);
router.post('/ai/review', authenticateJWT, aiCtrl.reviewCode);

export default router;
