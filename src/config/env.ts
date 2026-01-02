import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    NODE_ENV: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
};

export const env: EnvConfig = {
    PORT: parseInt(getEnvVariable('PORT', '5000'), 10),
    MONGODB_URI: getEnvVariable('MONGODB_URI'),
    JWT_SECRET: getEnvVariable('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '7d'),
    NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
};
