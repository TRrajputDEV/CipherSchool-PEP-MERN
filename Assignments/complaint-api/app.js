import express from 'express';
import complaintRouter from './routes/complaint.routes.js';
import loggerMiddleware from './middleware/logger.middleware.js';

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/complaints', complaintRouter);

export default app;