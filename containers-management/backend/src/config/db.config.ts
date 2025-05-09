import {MongooseDatabase} from '@/connexions/mongo.db';
import {IDatabase} from '@/interfaces/database';

const database: IDatabase = new MongooseDatabase();

export {database};