import mongoose, {Schema, Document, Model} from 'mongoose';
import {IRefreshTokenRepository} from '@/services/auth';

interface IRefreshTokenDoc extends Document {
    userId: string;
    token: string;
    expiresAt: Date;
}

const RefreshTokenSchema: Schema<IRefreshTokenDoc> = new Schema({
    userId: {type: "string", ref: 'User', required: true},
    token: {type: String, required: true, unique: true},
    expiresAt: {type: Date, required: true}
}, {timestamps: true});

const RefreshTokenModel: Model<IRefreshTokenDoc> = mongoose.models.RefreshToken || mongoose.model<IRefreshTokenDoc>('RefreshToken', RefreshTokenSchema);

export const refreshTokenRepository: IRefreshTokenRepository = {
    /**
     * Persist a new refresh token for a user.
     */
    create: async (userId, token, expiresAt) => {
        const doc = new RefreshTokenModel({userId, token, expiresAt});
        await doc.save();
    },

    /**
     * Lookup a refresh token by its string value.
     * Returns userId and expiresAt or null if not found.
     */
    findByToken: async (token) => {
        const doc = await RefreshTokenModel.findOne({token}).lean().exec();
        if (!doc) return null;
        return {userId: doc.userId.toString(), expiresAt: doc.expiresAt};
    },

    /**
     * Remove a refresh token, e.g. on logout or rotation.
     */
    deleteByToken: async (token) => {
        await RefreshTokenModel.deleteOne({token}).exec();
    },
};
