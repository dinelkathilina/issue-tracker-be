import { Request, Response } from 'express';
import * as UserService from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    // If error message is "User already exists", send 400, else 500
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};