import { Controller, Post, Delete, Get, Param, Req } from '@nestjs/common';
import { Auth, RoleEnum, successResponse } from 'src/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post(':userId')
  async follow(@Param('userId') userId: string, @Req() req) {
    const me = req.credentials.user._id;

    await this.followService.followUser(me, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Delete(':userId')
  async unfollow(@Param('userId') userId: string, @Req() req) {
    const me = req.credentials.user._id;

    await this.followService.unfollowUser(me, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('followers/:userId')
  async followers(@Param('userId') userId: string) {
    const data = await this.followService.getFollowers(userId);

    return successResponse({ data });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('following/:userId')
  async following(@Param('userId') userId: string) {
    const data = await this.followService.getFollowing(userId);

    return successResponse({ data });
  }
}
