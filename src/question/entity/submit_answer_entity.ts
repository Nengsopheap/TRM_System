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

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @ManyToOne(() => Option, (option) => option.answers)
  option: Option;

  @ManyToOne(() => Option, (option) => option.answers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  is_correct: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
