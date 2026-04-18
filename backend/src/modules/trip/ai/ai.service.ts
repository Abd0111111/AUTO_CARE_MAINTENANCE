import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async buildTrip(rawData: any, vehicle: any) {
    const summary = rawData.trip_summary || {};

    const brake = Number(rawData.harsh_brake_count ?? 0);
    const accel = Number(rawData.harsh_accel_count ?? 0);

    const distance = Number(summary.distance_km ?? 0);
    const duration = Number(summary.duration_min ?? 0);
    const avgSpeed = Number(summary.avg_speed ?? 0);
    const maxSpeed = Number(summary.max_speed ?? 0);

    const driver_score_raw = 100 - (brake * 5 + accel * 3);

    const driver_score = Math.max(0, Math.min(100, driver_score_raw || 0));

    const vehicle_info = this.mapVehicle(vehicle);

    const behavior_penalty = brake * 4 + accel * 3;

    const vehicle_health_score = Math.max(0, 100 - behavior_penalty);

    const vehicle_health = {
      vehicle_health_score: Math.round(vehicle_health_score),

      health_status:
        vehicle_health_score > 80
          ? 'Good'
          : vehicle_health_score > 60
            ? 'Normal'
            : 'Bad',

      maintenance_risk:
        vehicle_health_score > 80
          ? 'Low'
          : vehicle_health_score > 60
            ? 'Medium'
            : 'High',

      engine_health: 80,
      brake_health: Math.max(0, 100 - brake * 10),
      tire_health: 85,

      alerts: [],
    };

    const fuel_efficiency = {
      actual_fuel_l_100km: Number((vehicle.mileage / 10000).toFixed(2)),

      base_fuel_l_100km: 6.5,

      efficiency_label:
        vehicle.mileage < 50000
          ? 'Good'
          : vehicle.mileage < 100000
            ? 'Average'
            : 'Poor',

      trend: 'Stable',
    };

    return {
      trip_summary: {
        distance_km: distance,
        duration_min: duration,
        avg_speed: avgSpeed,
        max_speed: maxSpeed,
      },

      driving_behavior: {
        driver_score: isNaN(driver_score) ? 0 : driver_score,
        driver_style:
          driver_score > 80 ? 'Good' : driver_score > 60 ? 'Normal' : 'Bad',

        harsh_brake_count: brake,
        harsh_accel_count: accel,
      },

      vehicle_health,
      fuel_efficiency,
      vehicle_info,
    };
  }

  private mapVehicle(vehicle: any) {
    return {
      engine_cc: vehicle.engineCapacity,
      engine_power_hp: this.estimatePower(vehicle),
      weight_kg: this.estimateWeight(vehicle),
      fuel_combined_l_100km: vehicle.mileage / 10000,
      year: vehicle.year,
    };
  }

  private estimatePower(vehicle: any) {
    return vehicle.engineCapacity
      ? Math.round(vehicle.engineCapacity / 25)
      : 100;
  }

  private estimateWeight(vehicle: any) {
    return vehicle.engineCapacity
      ? Math.round(vehicle.engineCapacity * 0.6)
      : 1200;
  }
}
