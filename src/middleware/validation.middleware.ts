import { Request, Response, NextFunction } from 'express';
import {
    validateEmail,
    validatePassword,
    validateIssueStatus,
    validateIssuePriority,
    validateIssueSeverity,
    sanitizeString,
} from '../utils/validators';
import { AppError } from './error.middleware';

export const validateRegistration = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    if (!validateEmail(email)) {
        throw new AppError('Please provide a valid email address', 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        throw new AppError(passwordValidation.message || 'Invalid password', 400);
    }

    // Sanitize inputs
    req.body.email = sanitizeString(email);

    next();
};

export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    if (!validateEmail(email)) {
        throw new AppError('Please provide a valid email address', 400);
    }

    // Sanitize inputs
    req.body.email = sanitizeString(email);

    next();
};

export const validateIssueCreation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { title, description, priority, severity, status } = req.body;

    if (!title || !description || !priority) {
        throw new AppError('Title, description, and priority are required', 400);
    }

    if (!validateIssuePriority(priority)) {
        throw new AppError('Invalid priority value', 400);
    }

    if (severity && !validateIssueSeverity(severity)) {
        throw new AppError('Invalid severity value', 400);
    }

    if (status && !validateIssueStatus(status)) {
        throw new AppError('Invalid status value', 400);
    }

    // Sanitize inputs
    req.body.title = sanitizeString(title);
    req.body.description = sanitizeString(description);

    next();
};

export const validateIssueUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { title, description, priority, severity, status } = req.body;

    if (title !== undefined) {
        req.body.title = sanitizeString(title);
    }

    if (description !== undefined) {
        req.body.description = sanitizeString(description);
    }

    if (priority && !validateIssuePriority(priority)) {
        throw new AppError('Invalid priority value', 400);
    }

    if (severity && !validateIssueSeverity(severity)) {
        throw new AppError('Invalid severity value', 400);
    }

    if (status && !validateIssueStatus(status)) {
        throw new AppError('Invalid status value', 400);
    }

    next();
};
