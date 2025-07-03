import { Controller, Post, Body, Get,Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './entity/users.entity';
import { Param, Delete } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body()
    body: {
      email: string;
      password: string;
      role: UserRole;
      username: string;
    },
  ) {
    return this.usersService.createUser(
      body.email,
      body.password,
      body.role,
      body.username,
    );
  }

  @Get('all')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
  @Put(':id') // <--- ADD THIS LINE!
  async updateUser(
    @Param('id') id: number,
    @Body()
    body: {
      email?: string;
      username?: string;
      role?: UserRole;
      password?: string;
    },
  ) {
    return this.usersService.updateUser(id, body);
  }


  @Get('all-scores')
  async findAllScores() {
    return this.usersService.findAllScores();
  }
}
