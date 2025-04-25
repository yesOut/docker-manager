import { Collection, ObjectId, Document, Filter } from 'mongodb';
import { IRepository } from '@/interfaces/database';
import { Logger } from '@/utils/logger';

export class BaseRepository<T extends { id: string }> implements IRepository<T> {
    private logger = new Logger(this.constructor.name);

    constructor(private readonly collection: Collection<Document>) {}

    private convertDocumentToEntity(document: Document): T {
        const { _id, ...rest } = document;
        return { ...rest, id: _id.toString() } as T;
    }

    private convertEntityToMongoFilter(entityFilter: Record<string, unknown>): Filter<Document> {
        const mongoFilter = { ...entityFilter };
        if ('id' in mongoFilter) {
            mongoFilter._id = new ObjectId(mongoFilter.id as string);
            delete mongoFilter.id;
        }
        return mongoFilter;
    }

    async findById(id: string): Promise<T | null> {
        try {
            const document = await this.collection.findOne({
                _id: new ObjectId(id)
            });
            return document ? this.convertDocumentToEntity(document) : null;
        } catch (error) {
            this.logger.error(`Failed to find by ID ${id}:`, error);
            throw error;
        }
    }

    async findAll(filter: Record<string, unknown> = {}): Promise<T[]> {
        try {
            const mongoFilter = this.convertEntityToMongoFilter(filter);
            const documents = await this.collection.find(mongoFilter).toArray();
            return documents.map(doc => this.convertDocumentToEntity(doc));
        } catch (error) {
            this.logger.error('Failed to find all:', error);
            throw error;
        }
    }

    async create(entity: Omit<T, 'id'>): Promise<T> {
        try {
            const result = await this.collection.insertOne(entity as Document);
            return { ...entity, id: result.insertedId.toString() } as T;
        } catch (error) {
            this.logger.error('Failed to create:', error);
            throw error;
        }
    }

    async update(id: string, updates: Partial<T>): Promise<T | null> {
        try {
            const { id: _, ...restUpdates } = updates as Partial<Document>;
            const result = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: restUpdates },
                { returnDocument: 'after' }
            );
            if (!result || !result.value) {
                return null
            }
            return result.value ? this.convertDocumentToEntity(result.value) : null;
        } catch (error) {
            this.logger.error(`Failed to update ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount === 1;
        } catch (error) {
            this.logger.error(`Failed to delete ${id}:`, error);
            throw error;
        }
    }

    async exists(filter: Record<string, unknown>): Promise<boolean> {
        try {
            const mongoFilter = this.convertEntityToMongoFilter(filter);
            const count = await this.collection.countDocuments(mongoFilter);
            return count > 0;
        } catch (error) {
            this.logger.error('Existence check failed:', error);
            throw error;
        }
    }
}