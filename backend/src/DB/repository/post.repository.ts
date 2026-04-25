import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument as TDocument, Post } from '../models';

@Injectable()
export class PostRepository extends DatabaseRepository<Post> {
  constructor(
    @InjectModel(Post.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
