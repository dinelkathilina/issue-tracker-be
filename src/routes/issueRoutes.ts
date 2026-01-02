import { Router } from 'express';
import { createIssue, getIssues, updateIssue, getStats } from '../controllers/issueController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Public Routes (if any)
router.get('/', getIssues);
router.get('/stats', getStats);

// Protected Routes (Require Login)
router.post('/', protect, createIssue);
router.put('/:id', protect, updateIssue);

export default router;