// src/toptip/toptip.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toptip } from './entity/toptip.entity';
import { CreateToptipDto } from './dtos/create_totip.dto';

@Injectable()
export class ToptipService {
  constructor(
    @InjectRepository(Toptip)
    private readonly toptipRepository: Repository<Toptip>,
  ) {}

  create(createToptipDto: CreateToptipDto) {
    const toptip = this.toptipRepository.create(createToptipDto);
    return this.toptipRepository.save(toptip);
  }

  findAll() {
    return this.toptipRepository.find();
  }

  async update(id: number, updateDto: CreateToptipDto) {
    const toptip = await this.toptipRepository.findOneBy({ id });
    if (!toptip) throw new NotFoundException('Toptip not found');
    Object.assign(toptip, updateDto);
    return this.toptipRepository.save(toptip);
  }

  async remove(id: number) {
    const result = await this.toptipRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Toptip not found');
    return { message: 'Deleted successfully' };
  }
}
