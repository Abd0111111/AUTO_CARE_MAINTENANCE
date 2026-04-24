import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateVehicleDTO {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  engineCapacity: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mileage: number;

  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @Type(() => Number)
  @IsNumber()
  tankCapacity: number;

  @IsString()
  @IsNotEmpty()
  transmission: string;
}