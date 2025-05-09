import {Schema, model, HydratedDocument} from 'mongoose';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    country: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
}

export type IUserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        email: {type: String, required: true, unique: true, index: true},
        role: {
            type: String,
            enum: ['user', 'admin'],
            required: true,
            default: 'user'
        },
        password: {type: String, required: true}
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

export const UserModel = model<IUser>('User', UserSchema);