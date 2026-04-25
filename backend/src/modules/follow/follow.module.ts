import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowModel, FollowRepository } from 'src/DB';

@Module({
  imports: [FollowModel],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
})
export class FollowModule {}
