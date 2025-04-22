import { User } from '@/types/auth';
export interface UserInterface {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt?: Date;
}

export interface IUserRepository {
    create(user: Omit<User, 'id'|'createdAt'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}