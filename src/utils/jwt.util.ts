import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
    id: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions) as string;
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
