import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Import Routes
import userRoutes from './routes/userRoutes';
import issueRoutes from './routes/issueRoutes';

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express App
const app: Application = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware
app.use(cors()); // Allow requests from other domains (like your React frontend)
app.use(express.json()); // Parse incoming JSON payloads (e.g., req.body)

// 5. Mount Routes
// Any request starting with /api/users goes to userRoutes
app.use('/api/users', userRoutes); 
// Any request starting with /api/issues goes to issueRoutes
app.use('/api/issues', issueRoutes);

// 6. Basic Health Check Route (Optional)
app.get('/', (req: Request, res: Response) => {
  res.send('Issue Tracker API is running...');
});

// 7. Global Error Handler (Catch-all for errors)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 8. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});