import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './users.entity';
import { Assessment } from '../../assessment/entity/assessment.entity';

@Entity()
export class UserScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Assessment, (assessment) => assessment.scores, { onDelete: 'CASCADE' })
  assessment: Assessment;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  correct_answers: number;  // Track the correct answers count

  @Column({ default: 0 })
  wrong_answers: number;    // Track the wrong answers count

  @Column({ default: 0 })
  total_quizzes: number; 

  @Column('float', { nullable: true }) // Add this line to store the percentage
  percentage: number; 
}

export default UserScore;
