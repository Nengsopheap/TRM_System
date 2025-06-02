import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Assessment } from '../../assessment/entity/assessment.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_en: string;

  @Column()
  title_kh: string;

  @Column({ type: 'text', nullable: true })
  title_answer_en: string;

  @Column({ type: 'text', nullable: true })
  title_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  description_en: string;

  @Column({ type: 'text', nullable: true })
  description_kh: string;

  @Column({ type: 'text', nullable: true })
  content_en: string;

  @Column({ type: 'text', nullable: true })
  content_kh: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.lessons)
  assessment: Assessment;
}
