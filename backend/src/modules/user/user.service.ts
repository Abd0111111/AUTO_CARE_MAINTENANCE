import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FollowRepository, PostRepository, UserRepository } from 'src/DB';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getProfile(userId: string, viewerId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const viewerObjectId = new Types.ObjectId(viewerId);

    const user = await this.userRepository.findById({
      id: userObjectId,
    });

    const [followersCount, followingCount, postsCount, posts, isFollowing] =
      await Promise.all([
        this.followRepository.count({
          filter: { following: userObjectId },
        }),

        this.followRepository.count({
          filter: { follower: userObjectId },
        }),

        this.postRepository.count({
          filter: { createdBy: userObjectId, status: 'approved' },
        }),

        this.postRepository.find({
          filter: { createdBy: userObjectId, status: 'approved' },
          options: { sort: { createdAt: -1 } },
        }),

        this.followRepository.findOne({
          filter: {
            follower: viewerObjectId,
            following: userObjectId,
          },
        }),
      ]);

    return {
      user,
      stats: {
        followersCount,
        followingCount,
        postsCount,
      },
      posts,
      isFollowing: !!isFollowing,
    };
  }
  async getUserPosts(userId: string, page = 1, size = 10) {
    return this.postRepository.paginate({
      filter: {
        createdBy: new Types.ObjectId(userId),
        status: 'approved',
      },
      page,
      size,
    });
  }
}
