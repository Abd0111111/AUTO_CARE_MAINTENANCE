import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { FollowRepository } from 'src/DB';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException("You can't follow yourself");
    }

    const existing = await this.followRepository.findOne({
      filter: {
        follower: new Types.ObjectId(followerId),
        following: new Types.ObjectId(followingId),
      },
    });

    if (existing) {
      throw new BadRequestException('Already following this user');
    }

    await this.followRepository.create({
      data: [
        {
          follower: new Types.ObjectId(followerId),
          following: new Types.ObjectId(followingId),
        },
      ],
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    await this.followRepository.deleteOne({
      filter: {
        follower: new Types.ObjectId(followerId),
        following: new Types.ObjectId(followingId),
      },
    });
  }

  async getFollowers(userId: string) {
    return this.followRepository.find({
      filter: { following: new Types.ObjectId(userId) },
    });
  }

  async getFollowing(userId: string) {
    return this.followRepository.find({
      filter: { follower: new Types.ObjectId(userId) },
    });
  }

  async countFollowers(userId: string) {
    return this.followRepository.count({
      filter: { following: new Types.ObjectId(userId) },
    });
  }

  async countFollowing(userId: string) {
    return this.followRepository.count({
      filter: { follower: new Types.ObjectId(userId) },
    });
  }
}
