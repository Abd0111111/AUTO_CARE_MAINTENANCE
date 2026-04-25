import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop()
  assetsFolderId: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  tags: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['public', 'friends', 'onlyMe'],
    default: 'public',
  })
  availability: string;

  @Prop({
    type: String,
    enum: ['allow', 'disable'],
    default: 'allow',
  })
  allowComments: string;
}

const postSchema = SchemaFactory.createForClass(Post);

postSchema.index({ createdBy: 1 });
postSchema.index({ createdAt: -1 });
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

export const PostModel = MongooseModule.forFeature([
  { name: Post.name, schema: postSchema },
]);
