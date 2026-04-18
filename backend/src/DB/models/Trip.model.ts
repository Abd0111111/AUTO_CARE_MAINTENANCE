import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ITrip } from 'src/common';
import { SpeedLevelEnum } from 'src/common/enums/trip.enum';

@Schema({ timestamps: true })
export class Trip {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop() trip_id: string;

  @Prop() date: string;

  @Prop({ type: Object })
  trip_summary: {
    distance_km: number;
    duration_min: number;
    avg_speed: number;
    max_speed: number;
  };

  @Prop({ type: Object })
  driving_behavior: {
    driver_score: number;
    driver_style: string;
    harsh_brake_count: number;
    harsh_accel_count: number;
  };

  @Prop({ type: Object })
  vehicle_health: {
    vehicle_health_score: number;
    health_status: string;
    maintenance_risk: string;
    engine_health: number;
    brake_health: number;
    tire_health: number;
    alerts: any[];
  };

  @Prop({ type: Object })
  fuel_efficiency: {
    actual_fuel_l_100km: number;
    base_fuel_l_100km: number;
    efficiency_label: string;
    trend: string;
  };

  @Prop({ type: Object })
  vehicle_info: any;

  @Prop({ type: Boolean, default: false })
  confirmed: boolean;
}

const tripSchema = SchemaFactory.createForClass(Trip);
export type TripDocument = HydratedDocument<Trip>;
export const TripModel = MongooseModule.forFeature([
  { name: Trip.name, schema: tripSchema },
]);
