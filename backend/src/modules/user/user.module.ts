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
  VehicleModel,
  VehicleRepository,
} from 'src/DB';

@Module({
  imports: [UserModel, FollowModel, PostModel, VehicleModel],
  providers: [
    UserService,
    UserRepository,
    FollowRepository,
    PostRepository,
    VehicleRepository,
  ],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preAuth).forRoutes(UserController);
  }
}
