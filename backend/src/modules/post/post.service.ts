import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PostRepository, UserRepository } from 'src/DB';
import {
  AllowCommentsEnum,
  LikeActionEnum,
  PostAvailabilityEnum,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async validateTags(tags: string[], userId: string) {
    if (!tags?.length) return;

    const users = await this.userRepository.find({
      filter: {
        _id: {
          $in: tags.map((id) => new Types.ObjectId(id)),
          $ne: new Types.ObjectId(userId),
        },
      },
    });

    if (users.length !== tags.length) {
      throw new NotFoundException('some tagged users not exist');
    }
  }

  async createPost(body: any, userId: string) {
    await this.validateTags(body.tags, userId);

    const [post] = await this.postRepository.create({
      data: [
        {
          content: body.content,
          tags: body.tags?.length
            ? body.tags.map((id: string) => new Types.ObjectId(id))
            : [],
          createdBy: new Types.ObjectId(userId),
          allowComments: body.allowComments ?? AllowCommentsEnum.allow,
          availability: body.availability ?? PostAvailabilityEnum.public,
          status: 'pending',
        },
      ],
    });

    if (!post) {
      throw new BadRequestException('fail to create post');
    }
  }

  async updatePost(postId: string, body: any, userId: string) {
    const post = await this.postRepository.findOne({
      filter: {
        _id: new Types.ObjectId(postId),
        createdBy: new Types.ObjectId(userId),
      },
    });

    if (!post) throw new NotFoundException('post not found');

    await this.validateTags(body.tags, userId);

    const updated = await this.postRepository.updateOne({
      filter: { _id: new Types.ObjectId(postId) },
      update: {
        $set: {
          content: body.content ?? post.content,
          allowComments: body.allowComments ?? post.allowComments,
          availability: body.availability ?? post.availability,

          tags: body.tags
            ? body.tags.map((id: string) => new Types.ObjectId(id))
            : post.tags,
        },
      },
    });

    if (!updated.matchedCount) {
      throw new BadRequestException('update failed');
    }
  }

  async likePost(postId: string, userId: string, action: LikeActionEnum) {
    const update =
      action === 'unlike'
        ? { $pull: { likes: new Types.ObjectId(userId) } }
        : { $addToSet: { likes: new Types.ObjectId(userId) } };

    const post = await this.postRepository.findOneAndUpdate({
      filter: { _id: new Types.ObjectId(postId) },
      update,
    });

    if (!post) throw new NotFoundException('post not found');
  }

  async postList(user: any, page: number, size: number) {
    return this.postRepository.paginate({
      filter: { status: 'approved' },
      page,
      size,
    });
  }

  async changePostStatus(postId: string, status: string) {
    const post = await this.postRepository.findOne({
      filter: { _id: new Types.ObjectId(postId) },
    });

    if (!post) throw new NotFoundException('post not found');

    await this.postRepository.updateOne({
      filter: { _id: new Types.ObjectId(postId) },
      update: {
        $set: { status },
      },
    });
  }
}
