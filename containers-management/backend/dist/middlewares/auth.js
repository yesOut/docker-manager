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
exports.adminMiddleware = exports.createAuthMiddleware = exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(authService) {
        this.authService = authService;
        // ensure the return type is Promise<void>
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
                    throw new Error('Missing or invalid authorization header');
                }
                const token = authHeader.slice(7); // drop "Bearer "
                const payload = yield this.authService.verifyToken(token);
                // attach user to req
                req.user = {
                    userId: payload.userId,
                    email: payload.email,
                    role: payload.role,
                };
                next();
                return; // explicit void
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Authentication failed';
                res.status(401).json({ success: false, error: message });
                return; // explicit void
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
// factory function returns a RequestHandler
const createAuthMiddleware = (authService) => new AuthMiddleware(authService).authenticate;
exports.createAuthMiddleware = createAuthMiddleware;
// a plain middleware that also must return void
const adminMiddleware = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied' });
        return; // void
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
