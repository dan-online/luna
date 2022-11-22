import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import type { Types } from 'mongoose';
import { Field, ObjectType, UseMiddleware } from 'type-graphql';
import { SchoolGuard } from '../../api/guards/SchoolOwner';
import { mongooseConnection } from '../../utils/mongo';
import { UserSchema } from './User.model';

@ObjectType()
@modelOptions({ options: { customName: 'user' }, existingConnection: mongooseConnection, schemaOptions: { timestamps: true, autoIndex: true } })
export class SchoolSchema {
  public createdAt?: Date;
  public updatedAt?: Date;

  @Field(() => String)
  public _id!: Types.ObjectId;

  @Field()
  @prop()
  public name?: string;

  @UseMiddleware(SchoolGuard)
  @Field()
  @prop()
  public domain?: string;

  @prop({ default: false })
  public verifiedDomain!: boolean;

  @UseMiddleware(SchoolGuard)
  @Field(() => [UserSchema])
  @prop({ ref: () => UserSchema, default: [] })
  public owners!: Ref<UserSchema>[];
}

export const SchoolModel = getModelForClass(SchoolSchema);
