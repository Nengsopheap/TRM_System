// src/learntip/learntip.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnTip } from './entity/learntoptip.entity';
import { CreateLearnTipDto } from './dtos/create_learntip.dto';
import { Toptip } from '../toptip/entity/toptip.entity';


@Injectable()
export class LearnTipService {
  constructor(
    @InjectRepository(LearnTip)
    private readonly learnTipRepo: Repository<LearnTip>,

    @InjectRepository(Toptip)
    private readonly toptipRepo: Repository<Toptip>,
  ) {}

  async create(dto: CreateLearnTipDto) {
    const toptip = await this.toptipRepo.findOneBy({ id: dto.toptipId });
    if (!toptip) throw new NotFoundException('Toptip not found');

    const learnTip = this.learnTipRepo.create({
      title: dto.title,
      description: dto.description,
      case: dto.case,
      toptip,
    });

    return this.learnTipRepo.save(learnTip);
  }

  findAll() {
    return this.learnTipRepo.find({ relations: ['toptip'] });
  }

  findByToptipId(toptipId: number) {
    return this.learnTipRepo.find({
      where: { toptip: { id: toptipId } },
      relations: ['toptip'],
    });
  }


  async update(id: number, dto: CreateLearnTipDto) {
    const learnTip = await this.learnTipRepo.findOne({ where: { id }, relations: ['toptip'] });
    if (!learnTip) {
      throw new NotFoundException('LearnTip not found');
    }

    const toptip = await this.toptipRepo.findOneBy({ id: dto.toptipId });
    if (!toptip) {
      throw new NotFoundException('Toptip not found');
    }

    learnTip.title = dto.title;
    learnTip.description = dto.description;
    learnTip.case = dto.case;
    learnTip.toptip = toptip;

    return this.learnTipRepo.save(learnTip); // Save updated LearnTip
  }

  // Delete LearnTip by ID
  async remove(id: number) {
    const learnTip = await this.learnTipRepo.findOneBy({ id });
    if (!learnTip) {
      throw new NotFoundException('LearnTip not found');
    }

    return this.learnTipRepo.remove(learnTip); // Remove the LearnTip
  }
}
