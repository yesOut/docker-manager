import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export interface EnvironmentConfig {
    NODE_ENV: Environment;
    PORT: number;
    JWT_SECRET: string;
    SALT_ROUNDS: number;
    LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
    ENABLE_SWAGGER: boolean;
}

export const getConfig = (): EnvironmentConfig => ({
    NODE_ENV: (process.env.NODE_ENV || Environment.DEVELOPMENT) as Environment,
    PORT: parseInt(process.env.PORT || '4200', 10),
    JWT_SECRET: process.env.JWT_SECRET ||
        (process.env.NODE_ENV === Environment.PRODUCTION
            ? (() => { throw new Error('JWT_SECRET must be set in production') })()
            : 'fallback_dev_secret'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
    LOG_LEVEL: (process.env.LOG_LEVEL || 'info') as EnvironmentConfig['LOG_LEVEL'],
    ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
});

export const config = getConfig();