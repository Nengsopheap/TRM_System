import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './submit_answer_entity'; 
@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  option_text: string;

  @Column({ default: false })
  is_correct: boolean;

  @OneToMany(() => Answer, (answer) => answer.option)  // Add this line for reverse relation
  answers: Answer[];

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}


