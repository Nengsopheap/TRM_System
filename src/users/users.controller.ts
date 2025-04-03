import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body() body: { email: string; password: string; role: UserRole },
  ) {
    return this.usersService.createUser(body.email, body.password, body.role);
  }

  @Get('all')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
