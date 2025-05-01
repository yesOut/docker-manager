import mongoose, { Model, Document } from 'mongoose';
import { IDatabase, IRepository } from '@/interfaces/database';
import { BaseRepository } from '@/repositories/base.repository';

export class MongooseDatabase implements IDatabase {
    async connect(): Promise<void> {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/db';
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected (via Mongoose)');
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
    }

    getRepository<T extends Document>(model: Model<T>): IRepository<T> {
        return new BaseRepository<T>(model);
    }
}
