import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import UserScore from './user_score.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => UserScore, (userScore) => userScore.user)
  scores: UserScore[];
}
