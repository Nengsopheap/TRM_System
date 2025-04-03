import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entity/users.entity';
import { UserScore } from './entity/user_score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserScore])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
