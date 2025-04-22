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
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
                const userData = req.body;
                const user = yield this.authService.register(userData);
                res.status(201).json({
                    id: user.id,
                    email: user.email,
                    role: user.role
                });
            }
            catch (error) {
                this.handleError(res, error, 'Registration failed', 400);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
                const credentials = req.body;
                const token = yield this.authService.login(credentials);
                res.json({ token });
            }
            catch (error) {
                this.handleError(res, error, 'Login failed', 401);
            }
        });
    }
    handleError(res, error, defaultMessage, statusCode = 500) {
        const message = error instanceof Error ? error.message : defaultMessage;
        res.status(statusCode).json({ success: false, error: message });
    }
}
exports.AuthController = AuthController;
