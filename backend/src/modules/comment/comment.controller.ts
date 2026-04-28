import {
  Body,
  Controller,
  Delete,
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

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req,
  ): Promise<IResponse> {
    const user = req.credentials.user;
    await this.commentService.deleteComment(commentId, user);
    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':commentId/replies/:replyId')
  async updateReply(
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Body() body,
    @Req() req,
  ): Promise<IResponse> {
    const user = req.credentials.user;

    await this.commentService.updateReply(commentId, replyId, body, user);

    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Delete(':commentId/replies/:replyId')
  async deleteReply(
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Req() req,
  ): Promise<IResponse> {
    const user = req.credentials.user;

    await this.commentService.deleteReply(commentId, replyId, user);

    return successResponse();
  }
}
