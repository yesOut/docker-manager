import {Request, Response, NextFunction} from 'express';
import {AuthService} from '@/services/auth';
import {AuthPayload} from '@/types/auth';
import jwt from "jsonwebtoken";

declare module 'express' {
    interface Request {
        user?: AuthPayload;
    }
}

export class AuthMiddleware {
    constructor(private readonly authService: AuthService) {
    }

    public authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({error: 'Missing or invalid Authorization header'});
                return;
            }
            if (!authHeader.startsWith('Bearer ')) {
                res.status(401).json({error: 'Missing or invalid Authorization header'});
                return;
            } else {
                const token = authHeader.slice(7);
                const payload: AuthPayload = this.authService.verifyToken(token);
                req.user = {
                    userId: payload.userId,
                    email: payload.email,
                    role: payload.role,
                };
            }
            next();
            return;
        } catch (err: any) {
            const errorMessage = err.message || 'Authentication failed';
            res.status(401).json({error: errorMessage});
            return;
        }
    };
    public authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({error: 'Missing or invalid Authorization header'});
                return;
            }
            if (!authHeader.startsWith('Bearer ')) {
                res.status(401).json({error: 'Missing or invalid Authorization header'});
                return;
            }
            const token = authHeader.slice(7);
            const payload: AuthPayload = this.authService.verifyToken(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
            if (payload.role !== 'admin') {
                res.status(403).json({error: 'Access denied: Admins only'});
                return;
            }
            next();
            return;
        } catch (err: any) {
            const errorMessage = err.message || 'FORBIDDEN';
            res.status(403).json({error: errorMessage});
            return;
        }
    }
}