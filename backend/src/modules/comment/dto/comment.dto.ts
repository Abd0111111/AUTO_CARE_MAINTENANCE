import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class ReplyCommentDTO extends CreateCommentDTO {}


export class UpdateCommentDTO {
  @IsOptional()
  @IsString()
  content?: string;
}