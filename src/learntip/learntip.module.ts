// src/learntip/learntip.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearnTip } from './entity/learntoptip.entity';
import { LearnTipService } from './learntip.service';
import { LearnTipController } from './learntip.controller';
import { Toptip } from '../toptip/entity/toptip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearnTip, Toptip])],
  controllers: [LearnTipController],
  providers: [LearnTipService],
})
export class LearnTipModule {}
