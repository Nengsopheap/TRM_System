import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import UserScore from './user_score.entity';

export enum UserRole {
  NORMAL = 'normal',
  SPECIAL = 'special',
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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.NORMAL })
  role: UserRole;

  @OneToMany(() => UserScore, (userScore) => userScore.user)
  scores: UserScore[];
}
