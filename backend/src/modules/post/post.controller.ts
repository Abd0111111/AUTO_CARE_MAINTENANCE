import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDTO, LikeActionEnum } from './dto/post.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post()
  async createPost(
    @Body() body: CreatePostDTO,
    @Req() req,
  ): Promise<IResponse> {
    const userId = req.credentials.user._id;

    await this.postService.createPost(body, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() body,
    @Req() req,
  ): Promise<IResponse> {
    const userId = req.credentials.user._id;

    await this.postService.updatePost(postId, body, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':postId/like')
  async likePost(
    @Param('postId') postId: string,
    @Query('action') action: LikeActionEnum,
    @Req() req,
  ): Promise<IResponse> {
    const userId = req.credentials.user._id;

    await this.postService.likePost(postId, userId, action);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get()
  async postList(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Req() req,
  ): Promise<IResponse> {
    const user = req.credentials.user;

    const posts = await this.postService.postList(user, page, size);

    return successResponse({
      data: { posts },
    });
  }

  @Auth([RoleEnum.admin])
  @Patch(':postId/approve')
  async approvePost(@Param('postId') postId: string) {
    await this.postService.changePostStatus(postId, 'approved');
    return successResponse();
  }

  @Auth([RoleEnum.admin])
  @Patch(':postId/reject')
  async rejectPost(@Param('postId') postId: string) {
    await this.postService.changePostStatus(postId, 'rejected');
    return successResponse();
  }
}
