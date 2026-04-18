import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import {
  TripModel,
  TripRepository,
  VehicleModel,
  VehicleRepository,
} from 'src/DB';
import { AiService } from './ai/ai.service';

@Module({
  imports: [TripModel, VehicleModel],
  controllers: [TripController],
  providers: [TripService, AiService, TripRepository, VehicleRepository],
})
export class TripModule {}
