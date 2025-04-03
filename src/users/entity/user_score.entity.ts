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
}

export default UserScore;
