import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findOne(id: string): Promise<{
        id: any;
        email: string;
        name: string;
        age: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
}
