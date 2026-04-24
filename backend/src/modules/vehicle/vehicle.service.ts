import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository, VehicleRepository } from 'src/DB';
import { CreateVehicleDTO } from './dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createVehicle(userId: string, data: CreateVehicleDTO): Promise<string> {
    const userObjectId = new Types.ObjectId(userId);

    const existing = await this.vehicleRepository.findOne({
      filter: { userId: userObjectId },
    });

    if (existing) {
      throw new ConflictException('User already has a vehicle profile');
    }

    const vehicle = await this.vehicleRepository.create({
      data: [
        {
          ...data,
          userId: userObjectId,
        },
      ],
    });
    await this.userRepository.updateOne({
      filter: { _id: userObjectId },
      update: { vehicleId: vehicle[0]._id },
    });

    if (!vehicle.length) {
      throw new BadRequestException('fail to create vehicle');
    }

    return 'Done';
  }

  async getVehicle(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!vehicle) {
      throw new NotFoundException('vehicle not found');
    }

    return vehicle;
  }

  async getAllVehicles(page: number = 1, size: number = 5) {
    return this.vehicleRepository.paginate({
      filter: {},
      options: { sort: { createdAt: -1 } },
      page,
      size,
    });
  }

  async getUserVehicles(userId: string) {
    const vehicles = await this.vehicleRepository.find({
      filter: { userId: new Types.ObjectId(userId) },
      options: { sort: { createdAt: -1 } },
    });

    return vehicles;
  }

  async deleteVehicle(id: string): Promise<string> {
    const deleted = await this.vehicleRepository.deleteOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!deleted.deletedCount) {
      throw new NotFoundException('vehicle not found');
    }

    return 'Done';
  }
}
