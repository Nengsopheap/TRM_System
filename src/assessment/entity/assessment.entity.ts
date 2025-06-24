import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from './../../question/entity/question.entity';
import { UserScore } from './../../users/entity/user_score.entity';
import { Lesson } from './../../lesson/entity/lesson.entity'
import { Course } from 'src/course/entity/course.entity';  // Make sure path is exact

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
  @OneToMany(() => Question, (question) => question.assessment)
  questions: Question[]; // This is the reverse side of the relationship to Question
  @OneToMany(() => UserScore, (userScore) => userScore.assessment)
  scores: UserScore[];

    @OneToMany(() => Lesson, (lesson) => lesson.assessment)
  lessons: Lesson[];
  @OneToMany(() => Course, (course) => course.assessment)
  courses: Course[];


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
