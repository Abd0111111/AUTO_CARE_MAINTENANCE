import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VehicleDocument as TDocument, Vehicle } from '../models';

@Injectable()
export class VehicleRepository extends DatabaseRepository<Vehicle> {
  constructor(
    @InjectModel(Vehicle.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
