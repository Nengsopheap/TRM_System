import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,ManyToOne, UpdateDateColumn } from 'typeorm';
import { Course } from 'src/course/Entity/course.entity';
@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'SET NULL', nullable: true })
  course: Course;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
