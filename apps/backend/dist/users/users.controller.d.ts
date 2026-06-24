import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<User[]>;
    findOrCreateUser(body: {
        email: string;
        name: string;
        avatar?: string;
        role?: 'USER' | 'ADMIN';
    }): Promise<User>;
}
