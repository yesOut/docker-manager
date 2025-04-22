import { Router } from 'express';
import { AuthController } from '@/controllers/auth';
import { validationMiddleware } from '@/middlewares/validation';

export const createAuthRoutes = (authController: AuthController) => {
    const router = Router();

    router.post(
        '/register',
        validationMiddleware.authValidation.register,
        validationMiddleware.validateRequest,
        authController.register.bind(authController)
    );

    router.post(
        '/login',
        validationMiddleware.authValidation.login,
        validationMiddleware.validateRequest,
        authController.login.bind(authController)
    );

    return router;
};