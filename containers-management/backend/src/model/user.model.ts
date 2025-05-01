import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email:    { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
