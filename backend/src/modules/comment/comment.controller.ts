import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';
import { CommentService } from './comment.service';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post(':postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() body,
    @Req() req,
  ): Promise<IResponse> {
    const userId = req.credentials.user._id;

    await this.commentService.createComment(postId, body, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Post(':postId/:commentId/reply')
  async replyOnComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body,
    @Req() req,
  ): Promise<IResponse> {
    const userId = req.credentials.user._id;

    await this.commentService.replyOnComment(postId, commentId, body, userId);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() body,
    @Req() req,
  ): Promise<IResponse> {
    const user = req.credentials.user;

    const comment = await this.commentService.updateComment(
      commentId,
      body,
      user,
    );

    return successResponse();
  }
}
