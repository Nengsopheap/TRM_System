import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entity/users.entity';
import { UserScore } from './entity/user_score.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserScore) private userScoreRepo: Repository<UserScore>,
  ) {}

  async createUser(
    email: string,
    password: string,
    role: UserRole,
    username?: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role,
      username: username ?? 'DefaultUsername',
    });
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async findAll() {
    return this.userRepo.find();
  }

  async updateUser(
  id: number,
  body: { email?: string; username?: string; role?: UserRole; password?: string }
): Promise<User> {
  const user = await this.userRepo.findOne({ where: { id } });
  if (!user) throw new Error('User not found');

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  Object.assign(user, body); // update user fields
  return this.userRepo.save(user);
}


  async deleteUser(id: number) {
  const user = await this.userRepo.findOne({ where: { id } });
  if (!user) throw new Error('User not found');
  return this.userRepo.remove(user);
}


  async findAllScores() {
    return this.userScoreRepo.find({
      relations: ['assessment', 'user'],
    });
  }
}
