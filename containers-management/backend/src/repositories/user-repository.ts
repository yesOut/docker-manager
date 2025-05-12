import {UserModel, IUser} from '@/model/user.model';

export class UserRepository {
    async create(item: IUser): Promise<IUser> {
        return await UserModel.create(item);
    }

    async findAll(): Promise<IUser[]> {
        return await UserModel.find().exec();
    }

    async findById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id).exec();
    }

    async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, item, {new: true}).exec();
    }

    async delete(id: string): Promise<boolean> {
        const deletedUser = await UserModel.findByIdAndDelete(id).exec();
        return deletedUser !== null;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email}).exec();
    }
}

export const userRepository = new UserRepository();
