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
exports.UserRepository = void 0;
class UserRepository {
    constructor() {
        this.users = [];
    }
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = Object.assign(Object.assign({}, userData), { id: this.generateId(), createdAt: new Date() });
            this.users.push(newUser);
            return newUser;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.find(user => user.email === email) || null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.find(user => user.id === id) || null;
        });
    }
    update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.users.findIndex(user => user.id === id);
            if (index === -1)
                return null;
            const updatedUser = Object.assign(Object.assign({}, this.users[index]), updates);
            this.users[index] = updatedUser;
            return updatedUser;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialLength = this.users.length;
            this.users = this.users.filter(user => user.id !== id);
            return this.users.length < initialLength;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.map(user => (Object.assign(Object.assign({}, user), { password: '' // Never return passwords in real applications
             })));
        });
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
exports.UserRepository = UserRepository;
