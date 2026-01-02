import { IssueStatus, IssuePriority, IssueSeverity } from '../types';

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
};

export const validateIssueStatus = (status: string): boolean => {
    return Object.values(IssueStatus).includes(status as IssueStatus);
};

export const validateIssuePriority = (priority: string): boolean => {
    return Object.values(IssuePriority).includes(priority as IssuePriority);
};

export const validateIssueSeverity = (severity: string): boolean => {
    return Object.values(IssueSeverity).includes(severity as IssueSeverity);
};

export const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
};
