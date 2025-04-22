export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getRepository<T>(entity: new () => T): IRepository<T>;
}

export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(entity: Omit<T, 'id'>): Promise<T>;
    update(id: string, updates: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}