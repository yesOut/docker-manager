import {User} from '@/types/auth'

export class UserModel implements User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt;
    }
}