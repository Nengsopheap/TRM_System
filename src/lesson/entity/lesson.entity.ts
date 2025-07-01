import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Assessment } from '../../assessment/entity/assessment.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name_en: string;
  @Column({ nullable: true })
  name_kh: string;

  @Column()
  title_en: string;

  @Column()
  title_kh: string;

  @Column({ nullable: true })
  title1_en: string;

  @Column({ nullable: true })
  title1_kh: string;

  @Column({ nullable: true })
  title2_en: string;

  @Column({ nullable: true })
  title2_kh: string;

  @Column({ type: 'text', nullable: true })
  title_answer_en: string;

  @Column({ type: 'text', nullable: true })
  title_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  title1_answer_en: string;

  @Column({ type: 'text', nullable: true })
  title1_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  title2_answer_en: string;

  @Column({ type: 'text', nullable: true })
  title2_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  tip1_en: string;

  @Column({ type: 'text', nullable: true })
  tip1_kh: string;

  @Column({ type: 'text', nullable: true })
  tip2_en: string;

  @Column({ type: 'text', nullable: true })
  tip2_kh: string;

  @Column({ type: 'text', nullable: true })
  tip3_en: string;

  @Column({ type: 'text', nullable: true })
  tip3_kh: string;

  @Column({ type: 'text', nullable: true })
  tip4_en: string;

  @Column({ type: 'text', nullable: true })
  tip4_kh: string;

  @Column({ type: 'text', nullable: true })
  tip5_en: string;

  @Column({ type: 'text', nullable: true })
  tip5_kh: string;

  @Column({ type: 'text', nullable: true })
  tip1_answer_en: string;

  @Column({ type: 'text', nullable: true })
  tip1_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  tip2_answer_en: string;

  @Column({ type: 'text', nullable: true })
  tip2_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  tip3_answer_en: string;

  @Column({ type: 'text', nullable: true })
  tip3_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  tip4_answer_en: string;

  @Column({ type: 'text', nullable: true })
  tip4_answer_kh: string;

  @Column({ type: 'text', nullable: true })
  tip5_answer_en: string;

  @Column({ type: 'text', nullable: true })
  tip5_answer_kh: string;

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
