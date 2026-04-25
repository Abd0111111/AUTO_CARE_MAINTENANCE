import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';



@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  follower: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  following: Types.ObjectId;
}

export type FollowDocument = HydratedDocument<Follow>;
const followSchema = SchemaFactory.createForClass(Follow);
export const FollowModel = MongooseModule.forFeature([
  { name: Follow.name, schema: followSchema },
]);
