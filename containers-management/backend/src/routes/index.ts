import { Router } from 'express';
import containerRoutes from './containers';
/*
import { AdminController } from '@/controllers/admin';
*/
import { AuthService } from '@/services/auth';
import { UserRepository } from '@/repositories/user-repository';
import userRoutes from "@/routes/user.routes";

const appRouter = Router();

const userRepository = new UserRepository();
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
/*
const adminController = new AdminController(userRepository);
*/



appRouter.use('/containers', containerRoutes);
appRouter.use('/users', userRoutes);

export default appRouter;