"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRoutes = void 0;
// src/routes/admin.ts
const express_1 = require("express");
const validation_1 = require("@/middlewares/validation");
const auth_1 = require("@/middlewares/auth");
const createAdminRoutes = (adminController, authService) => {
    const router = (0, express_1.Router)();
    const authenticate = (0, auth_1.createAuthMiddleware)(authService);
    router.use(authenticate, auth_1.adminMiddleware);
    router.get('/users', adminController.getUsers.bind(adminController));
    router.patch('/users/:id/role', validation_1.validationMiddleware.adminValidation.userUpdate, validation_1.validationMiddleware.validateRequest, adminController.updateUserRole.bind(adminController));
    return router;
};
exports.createAdminRoutes = createAdminRoutes;
