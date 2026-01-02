import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/error.middleware';
import userRoutes from './routes/userRoutes';
import issueRoutes from './routes/issueRoutes';

// Create Express app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
});

export default app;
