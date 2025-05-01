import { Request, Response, NextFunction } from 'express';
import { userRepository } from '@/repositories/user-repository';

export class UserController {
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            const user = await userRepository.create(req.body);
            res.status(201).json(user);
        } catch (err: any) {
            next(err);
        }
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userRepository.findAll();
             res.json(users);
        } catch (err: any) {
            next(err);
        }
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userRepository.findById(req.params.id);
            if (!user)  res.status(404).json({ message: 'Not found' });
             res.json(user);
        } catch (err: any) {
            next(err);
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updated = await userRepository.update(req.params.id, req.body);
            if (!updated)  res.status(404).json({ message: 'Not found' });
             res.json(updated);
        } catch (err: any) {
            next(err);
        }
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const success = await userRepository.delete(req.params.id);
            if (!success)  res.status(404).json({ message: 'Not found' });
             res.json({ message: 'Deleted' });
        } catch (err: any) {
            next(err);
        }
    }
}

export const userController = new UserController();
