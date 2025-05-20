import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dtos/create_post.dto';
import { UpdatePostDto } from './dtos/update_post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  create(dto: CreatePostDto, imagePath: string): Promise<Post> {
    const post = this.postRepo.create({ ...dto, image: imagePath });
    return this.postRepo.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepo.find();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, dto: UpdatePostDto, imagePath?: string): Promise<Post> {
    const post = await this.findOne(id);
    if (dto.title) post.title = dto.title;
    if (imagePath) post.image = imagePath;
    return this.postRepo.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }
}
