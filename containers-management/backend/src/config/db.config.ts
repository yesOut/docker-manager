import { MongoDBDatabase } from '@/connexions/mongo.db';
import { IDatabase } from '@/interfaces/database';

const database: IDatabase = new MongoDBDatabase();

export { database };