import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { preAuth } from 'src/common';
import {
  FollowModel,
  FollowRepository,
  PostModel,
  PostRepository,
  UserModel,
  UserRepository,
} from 'src/DB';

@Module({
  imports: [UserModel, FollowModel, PostModel],
  providers: [UserService, UserRepository, FollowRepository, PostRepository],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preAuth).forRoutes(UserController);
  }
}
