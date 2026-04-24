import { Types } from 'mongoose';

export interface ITrip {
  user: Types.ObjectId;

  trip_id: string;
  date: string;

  trip_summary: {
    distance_km: number;
    duration_min: number;
    avg_speed: number;
    max_speed: number;
  };

  driving_behavior: {
    driver_score: number;
    driver_style: string;
    harsh_brake_count: number;
    harsh_accel_count: number;
  };

  vehicle_health: {
    vehicle_health_score: number;
    health_status: string;
    maintenance_risk: string;
    engine_health: number;
    brake_health: number;
    tire_health: number;
    alerts: any[];
  };

  fuel_efficiency: {
    actual_fuel_l_100km: number;
    base_fuel_l_100km: number;
    efficiency_label: string;
    trend: string;
  };

  vehicle_info: {
    engine_cc: number;
    engine_power_hp: number;
    weight_kg: number;
    fuel_combined_l_100km: number;
    year: number;
  };

  confirmed?: boolean;
}