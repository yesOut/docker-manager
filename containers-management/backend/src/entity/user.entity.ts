/*
import { Schema, model, Document } from 'mongoose';
import { User } from '@/types/auth';

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
    {
        id: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false },
        collection: 'users',
    }
);

export const UserModel = model<UserDocument>('User', UserSchema);
*/
