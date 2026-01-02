import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const result = await userService.registerUser({ email, password });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const result = await userService.loginUser({ email, password });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
