import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostModel, PostRepository, UserModel, UserRepository } from 'src/DB';

@Module({
  imports: [UserModel, PostModel],
  controllers: [PostController],
  providers: [PostService , UserRepository, PostRepository],
})
export class PostModule {}
