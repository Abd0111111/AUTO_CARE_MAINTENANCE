import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FollowDocument as TDocument, Follow } from '../models';

@Injectable()
export class FollowRepository extends DatabaseRepository<Follow> {
  constructor(
    @InjectModel(Follow.name)
    protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
