import {body, checkSchema, param, validationResult} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@/repositories/user-repository';
import {UserModel} from '@/model/user.model'

const userRepository = new UserRepository();
const roles=['user','admin'];
export const validationMiddleware = {
    validateRequest: (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },

    authValidation: {
        register: [
            body('firstName').isLength({ min: 1 }).withMessage('Valid firstName is required'),
            body('lastName').isLength({ min: 1 }).withMessage('Valid lastName is required'),
            body('phoneNumber').isLength({ min: 1 }).withMessage('Valid phone number is required'),
            body('state').isLength({ min: 1 }).withMessage('Valid state is required'),
            body('country').isLength({ min: 1 }).withMessage('Valid country is required'),
            body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
            body('role').optional().isIn(['user', 'admin']).withMessage('Invalid user role'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
            body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
        ],
        login: [
            body('email').isEmail().withMessage('Valid email required'),
            body('password').exists().withMessage('Password is required')
        ]
    },

    containerValidation: {
        idParam: [
            param('id')
                .isString()
                .isLength({ min: 64, max: 64 })
                .withMessage('Invalid container ID format')
                .matches(/^[a-f0-9]+$/i)
                .withMessage('Container ID must be hexadecimal')
        ],

        actionPayload: [
            body('force')
                .optional()
                .isBoolean()
                .withMessage('Force must be a boolean value')
        ]
    },

    adminValidation: {
        userUpdate: [
            body('role')
                .isIn(Object.values([roles]))
                .withMessage('Invalid user role'),
            body('isActive')
                .isBoolean()
                .withMessage('Active status must be a boolean')
        ]
    }
};

export type ValidationChain = Array<
    (req: Request, res: Response, next: NextFunction) => Promise<void>
>;

export const containerIdSchema = checkSchema({
    id: {
        in: ['params'],
        isString: true,
        isLength: {
            options: { min: 64, max: 64 },
            errorMessage: 'Container ID must be 64 characters long'
        },
        matches: {
            options: /^[a-f0-9]+$/i,
            errorMessage: 'Invalid container ID format'
        }
    }
});

export const uniqueEmailValidator = body('email').custom(async (email) => {
    const user = await userRepository.findByEmail(email);
    if (user) {
        throw new Error('Email already in use');
    }
});