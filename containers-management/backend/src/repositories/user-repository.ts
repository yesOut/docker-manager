import { IUserRepository, User } from '@/types/auth';

export class UserRepository implements IUserRepository {
    private users: User[] = [];

    async create(userData: Omit<User, 'id'>): Promise<User> {
        const newUser: User = {
            ...userData,
            id: this.generateId(),
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    async update(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null> {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) return null;

        const updatedUser = { ...this.users[index], ...updates };
        this.users[index] = updatedUser;
        return updatedUser;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        return this.users.length < initialLength;
    }

    async findAll(): Promise<User[]> {
        return this.users.map(user => ({
            ...user,
            password: '' // Never return passwords in real applications
        }));
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}