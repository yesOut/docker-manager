import {Router} from 'express';
import {body, validationResult} from 'express-validator';
import {AuthMiddleware} from '@/middlewares/auth';
import {userController} from '@/controllers/user.controller';
import {Request, Response, NextFunction} from 'express';
import {userRepository} from "@/repositories/user-repository";
import {authService} from "@/services";

const router = Router();
const authMiddleware = new AuthMiddleware(authService);

router.post(
    '/auth/login',
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
        }
        return userController.login(req, res, next);
    }
);
 router.post(
    '/auth/register',
    [
        body('email')
            .isEmail().withMessage('Invalid email address')
            .bail()
            .custom(async email => {
                const existing = await userRepository.findByEmail(email);
                if (existing) {
                    throw new Error('Email already in use');
                }
                return true;
            }),
        body('password')
            .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Confirm Passwords do not match');
                }
                return true;
            }),
        body('firstName')
            .notEmpty().withMessage('Name is required'),
        body('role')
            .isIn(['user']).withMessage('Role is required'),
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return;
        }
        return userController.createUser(req, res, next);
    }
);


router.get('/users',
    authMiddleware.authenticate,
    authMiddleware.authorize,
    userController.getAllUsers,
);

router.get('/users/:id', (req: Request, res: Response, next: NextFunction) =>
    userController.getUserById(req, res, next)
);

router.put(
    '/users/:id',
    [
        body('email').optional().isEmail().withMessage('Invalid email address'),
        body('password').optional().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
        body('name').optional().notEmpty().withMessage('Name is required'),
    ],
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
        }
        return userController.updateUser(req, res, next);
    }
);

router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) =>
    userController.deleteUser(req, res, next)
);

export default router;
