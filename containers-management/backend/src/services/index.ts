import { AuthService } from './auth';
import { userRepository } from '@/repositories/user-repository';
import { refreshTokenRepository } from '@/repositories/refresh-token-repository';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authService = new AuthService(
    userRepository,
    refreshTokenRepository,
    JWT_SECRET,
    Number(process.env.SALT_ROUNDS) || 10
);
