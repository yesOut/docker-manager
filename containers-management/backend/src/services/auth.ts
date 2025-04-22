import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '@/interfaces/user-repository';
import { LoginCredentials, RegistrationData, AuthPayload, User } from '@/types/auth';

export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtSecret: string,
        private readonly saltRounds: number = 10
    ) {}

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

    async login(credentials: LoginCredentials): Promise<string> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error('Invalid credentials');
        }
        return this.generateToken(user);
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
            { expiresIn: '1h' }
        );
    }
}
