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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor(userRepository, jwtSecret, saltRounds = 10) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.saltRounds = saltRounds;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, this.saltRounds);
            return this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        });
    }
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(credentials.email);
            if (!user || !(yield bcryptjs_1.default.compare(credentials.password, user.password))) {
                throw new Error('Invalid credentials');
            }
            return this.generateToken(user);
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch (_a) {
            throw new Error('Invalid or expired token');
        }
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, this.jwtSecret, { expiresIn: '1h' });
    }
}
exports.AuthService = AuthService;
