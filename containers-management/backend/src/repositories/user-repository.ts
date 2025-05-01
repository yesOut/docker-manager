import { UserModel, IUser } from '@/model/user.model';

export class UserRepository /* implements IRepository<IUser> */ {
    async create(item: IUser): Promise<IUser> {
        console.log(item,"hello");
        return await UserModel.create(item);
    }

    async findAll(): Promise<IUser[]> {
        return await UserModel.find().exec();
    }

    async findById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id).exec();
    }

    async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, item, { new: true }).exec();
    }

    async delete(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id).exec();
    }
}

export const userRepository = new UserRepository();
