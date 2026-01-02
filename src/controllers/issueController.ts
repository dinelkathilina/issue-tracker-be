import { Request, Response } from 'express';
import * as IssueService from '../services/issueService';

// Custom interface to include the User added by Auth Middleware
interface AuthRequest extends Request {
    user?: any;
}

// Create
export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        // req.user.id comes from the 'protect' middleware
        const issue = await IssueService.createIssue(req.body, req.user.id);
        res.status(201).json(issue);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to create issue' });
    }
};

// Get All (Search/Filter)
export const getIssues = async (req: Request, res: Response) => {
    try {
        const { search, status, priority, page, limit } = req.query;

        const result = await IssueService.getIssues({
            search: typeof search === 'string' ? search : undefined,
            status: typeof status === 'string' ? status : undefined,
            priority: typeof priority === 'string' ? priority : undefined,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching issues' });
    }
};

// Update
export const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Issue ID is required' });
        }

        const issue = await IssueService.updateIssue(id, req.body);
        res.json(issue);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

// Get Stats
export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await IssueService.getIssueStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};