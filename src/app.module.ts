import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auths/auths.module';
import { AssessmentModule } from './assessment/assessment.module';
import { QuestionModule } from './question/question.module';
import { Assessment } from './assessment/entity/assessment.entity';
import { Question } from './question/entity/question.entity';
import { Option } from './question/entity/option.entity';
import { Answer } from './question/entity/submit_answer_entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Pheap9999',
      database: process.env.DB_NAME || 'qcm_db',
      entities: [User, Assessment, Question, Option, Answer],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AssessmentModule,
    QuestionModule,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
