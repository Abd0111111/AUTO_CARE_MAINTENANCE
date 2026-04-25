import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument as TDocument, Comment } from '../models';

@Injectable()
export class CommentRepository extends DatabaseRepository<Comment> {
  constructor(
    @InjectModel(Comment.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
