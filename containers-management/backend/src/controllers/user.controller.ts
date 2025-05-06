import { Request, Response, NextFunction } from 'express';
import { userRepository } from '@/repositories/user-repository';
import bcrypt from "bcryptjs";
import {authService} from "@/services";



export class UserController {
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userRepository.create(req.body);
            res.status(201).json(user);
        } catch (err: any) {
            console.log(err);
            next(err);
        }
    }
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await userRepository.findByEmail(email);
            if (!user) {
                 res.status(401).json({ error: 'Invalid credentials' });
                 return;
            }

/*
            const match = await bcrypt.compare(password,user.password);

*/
            const match = password===user.password;

            if (!match) {
                 res.status(401).json({ error: 'Invalid credentials' });
                 return;
            }

            const payload = { userId:user.id.toString().toString(), email: user.email, role: user.role };
            const token =  authService.signToken(payload);

             res.json({
                user: {
                    id:       user.id,
                    firstName:user.firstName,
                    lastName: user.lastName,
                    email:    user.email,
                    role:     user.role,
                },
                token,
            });
        } catch (err: any) {
            next(err);
        }
    };

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userRepository.findAll();
             res.json(user);
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
