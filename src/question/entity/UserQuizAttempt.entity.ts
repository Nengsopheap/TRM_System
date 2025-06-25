import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { Assessment } from 'src/assessment/entity/assessment.entity';
import { Answer } from 'src/question/entity/submit_answer_entity';

@Entity()
export class UserQuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.quizAttempts)
  user: User;

  @ManyToOne(() => Assessment, (assessment) => assessment.quizAttempts)
  assessment: Assessment;

  @OneToMany(() => Answer, (answer) => answer.quizAttempt)
  answers: Answer[];

  @Column({ default: 0 })
  total_quizzes: number;

  @Column({ type: 'float', default: 0 })
  score: number;

  @Column({ default: 0 })
  correct_answers: number;

  @Column({ default: 0 })
  wrong_answers: number;

  @Column({ type: 'float', default: 0 })
  percentage: number;

  @CreateDateColumn()
  submitted_at: Date;
}
