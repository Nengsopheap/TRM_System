import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Option } from './option.entity';
import { Answer } from './submit_answer_entity';
import { Assessment } from './../../assessment/entity/assessment.entity';
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_text: string;

  @Column({ default: 'easy' }) // or numeric if you prefer
  category: string;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];

  @OneToMany(() => Answer, (answer) => answer.question) // Add this line for reverse relation
  answers: Answer[];

  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  assessment: Assessment; // Link to the assessment

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('json', { nullable: true })
  correct_option_id: string | number;

  @Column('simple-array', { nullable: true })
  correct_option_ids: number[];

  @Column({ default: false })
  is_multiple_choice: boolean;

  @Column({ default: false })
  is_yes_no: boolean;

  @Column('float', { default: 1 })
  points: number;
}
