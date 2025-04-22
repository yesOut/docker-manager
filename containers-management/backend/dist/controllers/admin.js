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
exports.AdminController = void 0;
const express_validator_1 = require("express-validator");
class AdminController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.findAll();
                res.json(users.map(this.sanitizeUser));
            }
            catch (error) {
                this.handleError(res, error, 'Failed to fetch users');
            }
        });
    }
    updateUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
                const { id } = req.params;
                const { role } = req.body;
                const user = yield this.userRepository.update(id, { role });
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                res.json(this.sanitizeUser(user));
            }
            catch (error) {
                this.handleError(res, error, 'Failed to update user role');
            }
        });
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };
    }
    handleError(res, error, defaultMessage) {
        const message = error instanceof Error ? error.message : defaultMessage;
        res.status(500).json({ success: false, error: message });
    }
}
exports.AdminController = AdminController;
