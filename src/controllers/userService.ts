import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Service for Registering a new user
export const registerUser = async (userData: Partial<IUser>) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const user = await User.create(userData);

    // Return user without password
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
    };
};

// Service for Logging in
export const loginUser = async (email: string, pass: string) => {
    // 1. Check if user exists (explicitly select password because it's hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(pass))) {
        throw new Error('Invalid email or password');
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
    };
};

// Helper to generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};