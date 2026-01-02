/// <reference path="../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. Please provide a valid token.',
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = verifyToken(token);
            req.user = {
                id: decoded.id,
                email: decoded.email,
            };
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.',
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
        return;
    }
};
