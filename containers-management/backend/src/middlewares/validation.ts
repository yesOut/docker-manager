import {body, checkSchema, param, validationResult} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@/types/auth';
import { UserRepository } from '@/repositories/user-repository';

const userRepository = new UserRepository();

export const validationMiddleware = {
    validateRequest: (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },

    // Auth validations
    authValidation: {
        register: [
            body('email')
                .isEmail()
                .withMessage('Valid email is required')
                .normalizeEmail(),
            body('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters'),
            body('confirmPassword')
                .custom((value, { req }) => value === req.body.password)
                .withMessage('Passwords do not match'),
            body('role')
                .optional()
                .isIn(Object.values(UserRole))
                .withMessage('Invalid user role')
        ],

        login: [
            body('email').isEmail().withMessage('Valid email required'),
            body('password').exists().withMessage('Password is required')
        ]
    },

    // Container validations
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

    // Admin validations
    adminValidation: {
        userUpdate: [
            body('role')
                .isIn(Object.values(UserRole))
                .withMessage('Invalid user role'),
            body('isActive')
                .isBoolean()
                .withMessage('Active status must be a boolean')
        ]
    }
};

// Utility type for validation chains
export type ValidationChain = Array<
    (req: Request, res: Response, next: NextFunction) => Promise<void>
>;

// Schema-based validation example (alternative approach)
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