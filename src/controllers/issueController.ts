/// <reference path="../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import * as issueService from '../services/issueService';
import { IssueFilterQuery } from '../types';

export const createIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, priority, severity, status } = req.body;
        const createdBy = req.user!.id;

        const issue = await issueService.createIssue({
            title,
            description,
            priority,
            severity,
            status,
            createdBy,
        });

        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            data: issue,
        });
    } catch (error) {
        next(error);
    }
};

export const getIssues = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            search,
            status,
            priority,
            severity,
            page,
            limit,
            sortBy,
            order,
        } = req.query;

        const query: IssueFilterQuery = {
            search: search as string,
            status: status as any,
            priority: priority as any,
            severity: severity as any,
            createdBy: req.user!.id,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            sortBy: sortBy as string,
            order: order as 'asc' | 'desc',
        };

        const result = await issueService.getIssues(query);

        res.status(200).json({
            success: true,
            message: 'Issues retrieved successfully',
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const getIssueById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Issue ID is required' });
            return;
        }

        const issue = await issueService.getIssueById(id);

        res.status(200).json({
            success: true,
            message: 'Issue retrieved successfully',
            data: issue,
        });
    } catch (error) {
        next(error);
    }
};

export const updateIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Issue ID is required' });
            return;
        }
        const updates = req.body;

        const issue = await issueService.updateIssue(id, updates);

        res.status(200).json({
            success: true,
            message: 'Issue updated successfully',
            data: issue,
        });
    } catch (error) {
        next(error);
    }
};

export const resolveIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Issue ID is required' });
            return;
        }

        const issue = await issueService.resolveIssue(id);

        res.status(200).json({
            success: true,
            message: 'Issue marked as resolved',
            data: issue,
        });
    } catch (error) {
        next(error);
    }
};

export const closeIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Issue ID is required' });
            return;
        }

        const issue = await issueService.closeIssue(id);

        res.status(200).json({
            success: true,
            message: 'Issue marked as closed',
            data: issue,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Issue ID is required' });
            return;
        }

        await issueService.deleteIssue(id);

        res.status(200).json({
            success: true,
            message: 'Issue deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getStatusCounts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.id;
        const counts = await issueService.getStatusCounts(userId);

        res.status(200).json({
            success: true,
            message: 'Status counts retrieved successfully',
            data: counts,
        });
    } catch (error) {
        next(error);
    }
};
