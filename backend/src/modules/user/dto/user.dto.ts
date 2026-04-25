import { IsMongoId, IsOptional } from 'class-validator';

export class GetProfileParamsDTO {
  @IsMongoId()
  userId: string;
}

export class GetProfileQueryDTO {
  @IsOptional()
  page?: number;

  @IsOptional()
  size?: number;
}