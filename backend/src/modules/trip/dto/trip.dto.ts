import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TripSummaryDTO {
  @IsNumber()
  distance_km: number;

  @IsNumber()
  duration_min: number;

  @IsNumber()
  avg_speed: number;

  @IsNumber()
  max_speed: number;
}

export class DrivingBehaviorDTO {
  @IsNumber()
  driver_score: number;

  @IsString()
  driver_style: string;

  @IsNumber()
  harsh_brake_count: number;

  @IsNumber()
  harsh_accel_count: number;
}

export class VehicleHealthAlertDTO {
  @IsString()
  component: string;

  @IsString()
  severity: string;

  @IsString()
  message: string;
}

export class VehicleHealthDTO {
  @IsNumber()
  vehicle_health_score: number;

  @IsString()
  health_status: string;

  @IsString()
  maintenance_risk: string;

  @IsNumber()
  engine_health: number;

  @IsNumber()
  brake_health: number;

  @IsNumber()
  tire_health: number;

  @IsOptional()
  @IsArray()
  alerts?: VehicleHealthAlertDTO[];
}

export class FuelEfficiencyDTO {
  @IsNumber()
  actual_fuel_l_100km: number;

  @IsNumber()
  base_fuel_l_100km: number;

  @IsString()
  efficiency_label: string;

  @IsString()
  trend: string;
}

export class VehicleInfoDTO {
  @IsNumber()
  engine_cc: number;

  @IsNumber()
  engine_power_hp: number;

  @IsNumber()
  weight_kg: number;

  @IsNumber()
  fuel_combined_l_100km: number;

  @IsNumber()
  year: number;
}

export class CreateTripDTO {
  @IsString()
  trip_id: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  start_time?: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @ValidateNested()
  @Type(() => TripSummaryDTO)
  trip_summary: TripSummaryDTO;

  @ValidateNested()
  @Type(() => DrivingBehaviorDTO)
  driving_behavior: DrivingBehaviorDTO;

  @ValidateNested()
  @Type(() => VehicleHealthDTO)
  vehicle_health: VehicleHealthDTO;

  @ValidateNested()
  @Type(() => FuelEfficiencyDTO)
  fuel_efficiency: FuelEfficiencyDTO;

  @ValidateNested()
  @Type(() => VehicleInfoDTO)
  vehicle_info: VehicleInfoDTO;
}

export class UpdateTripDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => TripSummaryDTO)
  trip_summary?: TripSummaryDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => DrivingBehaviorDTO)
  driving_behavior?: DrivingBehaviorDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleHealthDTO)
  vehicle_health?: VehicleHealthDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => FuelEfficiencyDTO)
  fuel_efficiency?: FuelEfficiencyDTO;
}