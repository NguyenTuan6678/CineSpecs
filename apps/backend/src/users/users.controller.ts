import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('find-or-create')
  async findOrCreateUser(
    @Body() body: { email: string; name: string; avatar?: string; role?: 'USER' | 'ADMIN' },
  ): Promise<User> {
    return this.usersService.findOrCreate(body);
  }
}
