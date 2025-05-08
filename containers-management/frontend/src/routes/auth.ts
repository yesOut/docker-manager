import express, { Request, Response } from 'express';
//import { AuthService } from '../../../backend/src/services/auth';
import { authService } from '../../../backend/src/services';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const tokens = await authService.login(req.body);
        res.json(tokens);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(401).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;