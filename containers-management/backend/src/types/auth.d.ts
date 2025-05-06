export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state:string;
    country: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    createdAt?: Date;
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

export interface IUserRepository {
    create(user: Omit<User, 'id'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<User[]>;
}