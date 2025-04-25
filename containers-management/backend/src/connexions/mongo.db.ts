    import { MongoClient, Db, Collection, Document } from 'mongodb';
    import { IDatabase, IRepository } from '@/interfaces/database';
    import { BaseRepository } from '@/repositories/base.repository';
    import { Logger } from '@/utils/logger';

    export interface IEntity extends Document {
        id: string;
    }

    export class MongoDBDatabase implements IDatabase {
        private client: MongoClient;
        private db: Db | null = null;
        private logger = new Logger('MongoDB');

        constructor() {
            const uri = process.env.DB_USER && process.env.DB_PASSWORD
                ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
                : `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
            try {
                this.client = new MongoClient(uri);
            }catch(err) {
                throw new Error(`MongoDB connection error: ${err}`);
            }
        }

        async connect(): Promise<void> {
            try {
                await this.client.connect();
                this.db = this.client.db(process.env.DB_NAME);
                this.logger.info('Connected to MongoDB');
            } catch (error) {
                this.logger.error('Connection failed:', error);
                throw error;
            }
        }

        async disconnect(): Promise<void> {
            await this.client.close();
            this.logger.info('Disconnected from MongoDB');
        }

        getRepository<T extends IEntity>(entity: new () => T): IRepository<T> {
            if (!this.db) throw new Error('Database not initialized');
            const collectionName = entity.name.toLowerCase() + 's';

            const collection = this.db.collection(collectionName);
            return new BaseRepository<T>(collection);
        }
    }