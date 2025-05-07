import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {IUserRepository} from '@/interfaces/user-repository';
import {LoginCredentials, RegistrationData, AuthPayload, User} from '@/types/auth';

export interface IRefreshTokenRepository {
    create(userId: string, token: string, expiresAt: Date): Promise<void>;

    findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;

    deleteByToken(token: string): Promise<void>;
}

export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly jwtSecret: string,
        private readonly saltRounds: number = 10,
    ) {
    }

    async register(userData: RegistrationData): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
        return this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    async login(credentials: LoginCredentials): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const accessToken = this.generateToken(user);
        const refreshToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);
        return {accessToken, refreshToken};
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const tokenData = await this.refreshTokenRepository.findByToken(refreshToken);
        if (!tokenData || tokenData.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }

        const user = await this.userRepository.findById(tokenData.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newAccessToken = this.generateToken(user);
        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const newExpiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        await this.refreshTokenRepository.deleteByToken(refreshToken);
        await this.refreshTokenRepository.create(user.id, newRefreshToken, newExpiresAt);

        return {accessToken: newAccessToken, refreshToken: newRefreshToken};
    }

    async logout(refreshToken: string): Promise<void> {
        await this.refreshTokenRepository.deleteByToken(refreshToken);
    }

    verifyToken(token: string): AuthPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as AuthPayload;
        } catch {
            throw new Error('Invalid or expired token');
        }
    }

    private generateToken(user: User): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            this.jwtSecret,
            {expiresIn: '1h'}
        );
    }

    public signToken(payload: AuthPayload): string {
        return jwt.sign(payload, this.jwtSecret, {expiresIn: '0.2h'});
    }
}