import { User } from '../models/User';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';

interface RegisterInput {
    email: string;
    password: string;
}

interface LoginInput {
    email: string;
    password: string;
}

interface AuthResponse {
    user: {
        id: string;
        email: string;
    };
    token: string;
}

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
    const { email, password } = input;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User with this email already exists', 400);
    }

    // Create new user
    const user = await User.create({
        email,
        password,
    });

    // Generate token
    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
    });

    return {
        user: {
            id: user._id.toString(),
            email: user.email,
        },
        token,
    };
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
    const { email, password } = input;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
    });

    return {
        user: {
            id: user._id.toString(),
            email: user.email,
        },
        token,
    };
};
