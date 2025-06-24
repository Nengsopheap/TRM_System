import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Assessment } from 'src/assessment/entity/assessment.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'beginner' })
  level: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  course_url?: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.courses, {
    eager: true,
  })
  assessment: Assessment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
