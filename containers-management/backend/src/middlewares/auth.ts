// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth';
import { AuthPayload } from '@/types/auth';

export class AuthMiddleware {
    constructor(private readonly authService: AuthService) {}

    // ensure the return type is Promise<void>
    authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                throw new Error('Missing or invalid authorization header');
            }

            const token = authHeader.slice(7); // drop "Bearer "
            const payload: AuthPayload = await this.authService.verifyToken(token);

            // attach user to req
            req.user = {
                userId: payload.userId,
                email:  payload.email,
                role:   payload.role,
            };

            next();
            return; // explicit void
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Authentication failed';
            res.status(401).json({ success: false, error: message });
            return; // explicit void
        }
    };
}

// factory function returns a RequestHandler
export const createAuthMiddleware = (authService: AuthService) =>
    new AuthMiddleware(authService).authenticate;

// a plain middleware that also must return void
export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied' });
        return; // void
    }
    next();
};
