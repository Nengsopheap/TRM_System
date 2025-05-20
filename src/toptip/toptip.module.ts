// src/toptip/toptip.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toptip } from './entity/toptip.entity';
import { ToptipService } from './toptip.service';
import { ToptipController } from './toptip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Toptip])],
  controllers: [ToptipController],
  providers: [ToptipService],
})
export class ToptipModule {}
