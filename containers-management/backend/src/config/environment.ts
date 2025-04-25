import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface EnvironmentConfig {
    nodeEnv: Environment;
    port: number;
    jwtSecret: string;
    saltRounds: number;
    logLevel: LogLevel;
    enableSwagger: boolean;
}

class ConfigValidator {
    static validateEnvironment(value: string): Environment {
        if (!Object.values(Environment).includes(value as Environment)) {
            throw new Error(`Invalid NODE_ENV: ${value}`);
        }
        return value as Environment;
    }

    static validatePort(value: string): number {
        const port = parseInt(value, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            throw new Error(`Invalid PORT: ${value}`);
        }
        return port;
    }

    static validateJwtSecret(value: string | undefined, environment: Environment): string {
        if (!value && environment === Environment.PRODUCTION) {
            throw new Error('JWT_SECRET must be set in production');
        }
        return value || 'fallback_dev_secret';
    }

    static validateSaltRounds(value: string): number {
        const rounds = parseInt(value, 10);
        if (isNaN(rounds) || rounds < 8 || rounds > 15) {
            throw new Error(`Invalid SALT_ROUNDS: ${value}. Must be between 8-15`);
        }
        return rounds;
    }

    static validateLogLevel(value: string): LogLevel {
        const validLevels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
        if (!validLevels.includes(value as LogLevel)) {
            throw new Error(`Invalid LOG_LEVEL: ${value}`);
        }
        return value as LogLevel;
    }

    static validateBoolean(value: string | undefined, defaultValue: boolean): boolean {
        if (value === undefined) return defaultValue;
        return value.toLowerCase() === 'true';
    }
}

class ConfigFactory {
    static createConfig(env: NodeJS.ProcessEnv): EnvironmentConfig {
        const nodeEnv = ConfigValidator.validateEnvironment(env.NODE_ENV || Environment.DEVELOPMENT);

        return {
            nodeEnv,
            port: ConfigValidator.validatePort(env.PORT || '4200'),
            jwtSecret: ConfigValidator.validateJwtSecret(env.JWT_SECRET, nodeEnv),
            saltRounds: ConfigValidator.validateSaltRounds(env.SALT_ROUNDS || '10'),
            logLevel: ConfigValidator.validateLogLevel(env.LOG_LEVEL || 'info'),
            enableSwagger: ConfigValidator.validateBoolean(env.ENABLE_SWAGGER, nodeEnv === Environment.DEVELOPMENT),
        };
    }
}

export const config = ConfigFactory.createConfig(process.env);