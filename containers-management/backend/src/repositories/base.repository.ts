import {Model, Document} from 'mongoose';
import {IRepository} from '@/interfaces/database';

export class BaseRepository<T extends Document> implements IRepository<T> {
    constructor(private model: Model<T>) {
    }

    findById(id: string) {
        return this.model.findById(id).exec();
    }

    findAll() {
        return this.model.find().exec();
    }

    create(item: Partial<T>) {
        return this.model.create(item);
    }

    update(id: string, updates: Partial<T>) {
        return this.model.findByIdAndUpdate(id, updates, {new: true}).exec();
    }

    async delete(id: string) {
        const doc = await this.model.findByIdAndDelete(id).exec();
        return doc !== null;
    }
}
