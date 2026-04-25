import { IsMongoId } from 'class-validator';

export class FollowDTO {
  @IsMongoId()
  userId: string;
}


export class UnfollowDTO {
  @IsMongoId()
  userId: string;
}


export class UserRelationDTO {
  @IsMongoId()
  targetUserId: string;
}

export class FollowResponseDTO {
  followerId: string;
  followingId: string;
  createdAt?: Date;
}