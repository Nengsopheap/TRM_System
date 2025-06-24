import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import UserScore from './user_score.entity';
import { Answer } from 'src/question/entity/submit_answer_entity'; // ✅ adjust this path as needed

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

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
