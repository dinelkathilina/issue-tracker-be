import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val: any) => val.message);
        const message = messages.join('. ');
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new AppError(message, 401);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
