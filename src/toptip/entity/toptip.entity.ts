// src/toptip/entity/toptip.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LearnTip } from '../../learntip/entity/learntoptip.entity';

@Entity()
export class Toptip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => LearnTip, (learnTip) => learnTip.toptip)
  learnTips: LearnTip[];
}
