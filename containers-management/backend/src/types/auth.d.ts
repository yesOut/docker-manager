export interface User {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegistrationData extends Omit<User, 'id' | 'createdAt'> {
    password: string;
}

export interface AuthPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export class User {
    id: string;
    email:string;
    role: string;
    createdAt:Date;
}
export class UserRole{
    id: string;
    role: 'user' | 'admin';
}
export interface IUserRepository {
    create(user: Omit<User, 'id'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<User[]>;
}