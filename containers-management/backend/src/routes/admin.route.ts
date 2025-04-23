import { Router } from 'express';
import { AdminController } from '@/controllers/admin';
import { validationMiddleware } from '@/middlewares/validation';
import {
    createAuthMiddleware,
    adminMiddleware,
} from '@/middlewares/auth';
import { AuthService } from '@/services/auth';

export const createAdminRoutes = (
    adminController: AdminController,
    authService: AuthService
) => {
    const router = Router();
    const authenticate = createAuthMiddleware(authService);

    router.use(authenticate, adminMiddleware);

    router.get(
        '/users',
        adminController.getUsers.bind(adminController),
    );

    router.patch(
        '/users/:id/role',
        validationMiddleware.adminValidation.userUpdate,
        validationMiddleware.validateRequest,
        adminController.updateUserRole.bind(adminController),
    );

    return router;
};
