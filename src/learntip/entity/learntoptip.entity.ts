// src/learntip/entities/learntip.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Toptip } from '../../toptip/entity/toptip.entity';

@Entity()
export class LearnTip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  case: string;

  @ManyToOne(() => Toptip, (toptip) => toptip.learnTips, { onDelete: 'CASCADE' })
  toptip: Toptip;
}
