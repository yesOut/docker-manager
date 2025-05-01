/*
import { Request, Response } from 'express';
import { UserRepository } from '@/repositories/user-repository';
import { validationResult } from 'express-validator';
import { User } from '@/types/auth';

export class AdminController {
    constructor(private readonly userRepository: UserRepository) {}

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.userRepository.findAll();
            res.json(users.map(this.sanitizeUser));
        } catch (error) {
            this.handleError(res, error, 'Failed to fetch users');
        }
    }

    async updateUserRole(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params;
            const { role } = req.body;

            const user = await this.userRepository.update(id, { role });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json(this.sanitizeUser(user));
        } catch (error) {
            this.handleError(res, error, 'Failed to update user role');
        }
    }


    private sanitizeUser(user: User) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
    }

    private handleError(res: Response, error: unknown, defaultMessage: string) {
        const message = error instanceof Error ? error.message : defaultMessage;
        res.status(500).json({ success: false, error: message });
    }
}*/
