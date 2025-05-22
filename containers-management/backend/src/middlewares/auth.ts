import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth';
import { AuthPayload } from '@/types/auth';

declare module 'express' {
    interface Request {
        user?: AuthPayload;
    }
}

export class AuthMiddleware {
    constructor(private readonly authService: AuthService) {}

    private extractToken(req: Request): string | null {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.slice(7);
    }

    public authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = this.extractToken(req);
            if (!token) {
                res.status(401).json({ error: 'Missing or invalid Authorization header' });
                return;
            }
            const payload: AuthPayload = this.authService.verifyToken(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
            next();
        } catch (err: any) {
            res.status(401).json({ error: err.message || 'Authentication failed' });
        }
    };

    public authorize = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = this.extractToken(req);
            if (!token) {
                res.status(401).json({ error: 'Missing or invalid Authorization header' });
                return;
            }
            const payload: AuthPayload = this.authService.verifyToken(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
            if (payload.role !== 'admin') {
                res.status(403).json({ error: 'Access denied: Admins only' });
                return;
            }
            next();
        } catch (err: any) {
            res.status(403).json({ error: err.message || 'FORBIDDEN' });
        }
    };
}