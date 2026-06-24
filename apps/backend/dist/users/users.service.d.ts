import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOrCreate(data: {
        email: string;
        name: string;
        avatar?: string;
        role?: 'USER' | 'ADMIN';
    }): Promise<User>;
}
