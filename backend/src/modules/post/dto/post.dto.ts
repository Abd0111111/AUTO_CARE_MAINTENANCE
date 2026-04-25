import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';


export enum PostAvailabilityEnum {
  public = 'public',
  friends = 'friends',
  onlyMe = 'onlyMe',
}

export enum AllowCommentsEnum {
  allow = 'allow',
  disable = 'disable',
}

export enum LikeActionEnum {
  like = 'like',
  unlike = 'unlike',
}

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsEnum(PostAvailabilityEnum)
  availability?: PostAvailabilityEnum;

  @IsOptional()
  @IsEnum(AllowCommentsEnum)
  allowComments?: AllowCommentsEnum;
}

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  removedTags?: string[];

  @IsOptional()
  @IsArray()
  removedAttachments?: string[];

  @IsOptional()
  @IsEnum(PostAvailabilityEnum)
  availability?: PostAvailabilityEnum;

  @IsOptional()
  @IsEnum(AllowCommentsEnum)
  allowComments?: AllowCommentsEnum;
}


export class LikePostQueryDTO {
  @IsEnum(LikeActionEnum)
  action: LikeActionEnum;
}