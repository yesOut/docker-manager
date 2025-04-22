"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueEmailValidator = exports.containerIdSchema = exports.validationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const auth_1 = require("@/types/auth");
const user_repository_1 = require("@/repositories/user-repository");
const userRepository = new user_repository_1.UserRepository();
exports.validationMiddleware = {
    validateRequest: (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    // Auth validations
    authValidation: {
        register: [
            (0, express_validator_1.body)('email')
                .isEmail()
                .withMessage('Valid email is required')
                .normalizeEmail(),
            (0, express_validator_1.body)('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters'),
            (0, express_validator_1.body)('confirmPassword')
                .custom((value, { req }) => value === req.body.password)
                .withMessage('Passwords do not match'),
            (0, express_validator_1.body)('role')
                .optional()
                .isIn(Object.values(auth_1.UserRole))
                .withMessage('Invalid user role')
        ],
        login: [
            (0, express_validator_1.body)('email').isEmail().withMessage('Valid email required'),
            (0, express_validator_1.body)('password').exists().withMessage('Password is required')
        ]
    },
    // Container validations
    containerValidation: {
        idParam: [
            (0, express_validator_1.param)('id')
                .isString()
                .isLength({ min: 64, max: 64 })
                .withMessage('Invalid container ID format')
                .matches(/^[a-f0-9]+$/i)
                .withMessage('Container ID must be hexadecimal')
        ],
        actionPayload: [
            (0, express_validator_1.body)('force')
                .optional()
                .isBoolean()
                .withMessage('Force must be a boolean value')
        ]
    },
    // Admin validations
    adminValidation: {
        userUpdate: [
            (0, express_validator_1.body)('role')
                .isIn(Object.values(auth_1.UserRole))
                .withMessage('Invalid user role'),
            (0, express_validator_1.body)('isActive')
                .isBoolean()
                .withMessage('Active status must be a boolean')
        ]
    }
};
// Schema-based validation example (alternative approach)
exports.containerIdSchema = (0, express_validator_1.checkSchema)({
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
exports.uniqueEmailValidator = (0, express_validator_1.body)('email').custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findByEmail(email);
    if (user) {
        throw new Error('Email already in use');
    }
}));
