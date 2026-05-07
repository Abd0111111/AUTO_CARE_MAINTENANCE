import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {
  CommentModel,
  CommentRepository,
  FollowModel,
  FollowRepository,
  PostModel,
  PostRepository,
  UserModel,
  UserRepository,
} from 'src/DB';

@Module({
  imports: [UserModel, PostModel, FollowModel, CommentModel],
  controllers: [PostController],
  providers: [
    PostService,
    UserRepository,
    PostRepository,
    FollowRepository,
    CommentRepository,
  ],
})
export class PostModule {}
