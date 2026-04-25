import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  // لو null = comment عادي
  // لو فيه قيمة = reply
  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  commentId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  tags: Types.ObjectId[];

  @Prop({ type: Date })
  freezedAt: Date;
}

const commentSchema = SchemaFactory.createForClass(Comment);

/**
 * 🔥 replies (nested comments)
 */
commentSchema.virtual('reply', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'commentId',
});

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

export const CommentModel = MongooseModule.forFeature([
  { name: Comment.name, schema: commentSchema },
]);