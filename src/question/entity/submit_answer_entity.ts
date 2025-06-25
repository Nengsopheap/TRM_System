import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { User } from 'src/users/entity/users.entity'; 
import { UserQuizAttempt } from 'src/question/entity/UserQuizAttempt.entity'; // Adjust this path as needed
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @ManyToOne(() => Option, (option) => option.answers, { onDelete: 'CASCADE' })
  option: Option;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'user_id' }) // ✅ This is fine now
  user: User;

  @ManyToOne(() => UserQuizAttempt, (attempt) => attempt.answers)
quizAttempt: UserQuizAttempt;

  @Column()
  is_correct: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

