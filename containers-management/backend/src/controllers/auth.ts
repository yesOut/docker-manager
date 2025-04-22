import { Request, Response } from 'express';
import { AuthService } from '@/services/auth';
import { validationResult } from 'express-validator';
import { LoginCredentials, RegistrationData } from '@/types/auth';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const userData: RegistrationData = req.body;
            const user = await this.authService.register(userData);
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            this.handleError(res, error, 'Registration failed', 400);
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const credentials: LoginCredentials = req.body;
            const token = await this.authService.login(credentials);
            res.json({ token });
        } catch (error) {
            this.handleError(res, error, 'Login failed', 401);
        }
    }

    private handleError(
        res: Response,
        error: unknown,
        defaultMessage: string,
        statusCode = 500
    ) {
        const message = error instanceof Error ? error.message : defaultMessage;
        res.status(statusCode).json({ success: false, error: message });
    }
}