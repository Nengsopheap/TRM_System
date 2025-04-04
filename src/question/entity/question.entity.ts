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

  @Column({ nullable: true })
  correct_option_id: number;

  @Column('simple-array', { nullable: true })
  correct_option_ids: number[];

  @Column({ default: false }) // ✅ NEW: Adds support for multiple-choice questions.
  is_multiple_choice: boolean;

  @Column('float', { default: 1 })  // Changed to float
  points: number;
}
