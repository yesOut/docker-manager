import { Model, Document } from 'mongoose';

export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(item: Partial<T>): Promise<T>;
    update(id: string, updates: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getRepository<T extends Document>(model: Model<T>): IRepository<T>;
}


