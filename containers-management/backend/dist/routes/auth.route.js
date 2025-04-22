"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = void 0;
const express_1 = require("express");
const validation_1 = require("@/middlewares/validation");
const createAuthRoutes = (authController) => {
    const router = (0, express_1.Router)();
    router.post('/register', validation_1.validationMiddleware.authValidation.register, validation_1.validationMiddleware.validateRequest, authController.register.bind(authController));
    router.post('/login', validation_1.validationMiddleware.authValidation.login, validation_1.validationMiddleware.validateRequest, authController.login.bind(authController));
    return router;
};
exports.createAuthRoutes = createAuthRoutes;
