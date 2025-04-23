import { Router } from 'express';
import { createAuthRoutes } from './auth.route';
import { createAdminRoutes } from './admin.route';
import containerRoutes from './containers';
import { AuthController } from '@/controllers/auth';
import { AdminController } from '@/controllers/admin';
import { AuthService } from '@/services/auth';
import { UserRepository } from '@/repositories/user-repository';

const appRouter = Router();

const userRepository = new UserRepository();
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const authService = new AuthService(userRepository, jwtSecret, saltRounds);
const authController = new AuthController(authService);
const adminController = new AdminController(userRepository);


appRouter.use('/auth', createAuthRoutes(authController));
appRouter.use('/admin', createAdminRoutes(adminController, authService));
appRouter.use('/containers', containerRoutes);

export default appRouter;