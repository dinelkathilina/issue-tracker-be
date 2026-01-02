import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token found
        if (!token) {
            res.status(401).json({ message: 'Not authorized, no token provided' });
            return;
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        // Get user from token (exclude password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found' });
            return;
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        } else {
            res.status(500).json({ message: 'Server error in authentication' });
        }
    }
};
