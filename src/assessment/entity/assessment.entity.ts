import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './../../question/entity/question.entity';
import { UserScore } from './../../users/entity/user_score.entity';
@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  parent_id: number | null;

  @OneToMany(() => Question, (question) => question.assessment)
  questions: Question[]; // This is the reverse side of the relationship to Question
  @OneToMany(() => UserScore, (userScore) => userScore.assessment)
  scores: UserScore[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
