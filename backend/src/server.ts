import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProblemRoutes } from './routes/problems';
import { createExecutionRoutes } from './routes/execution';
import { createSubmissionRoutes } from './routes/submissions';
import { createProgressRoutes } from './routes/progress';
import { createBookmarkRoutes } from './routes/bookmarks';
import { createNotesRoutes } from './routes/notes';
import { createDraftRoutes } from './routes/drafts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/problems', createProblemRoutes());
app.use('/api/run', createExecutionRoutes());
app.use('/api/submit', createSubmissionRoutes());
app.use('/api/progress', createProgressRoutes());
app.use('/api/bookmarks', createBookmarkRoutes());
app.use('/api/notes', createNotesRoutes());
app.use('/api/drafts', createDraftRoutes());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;
