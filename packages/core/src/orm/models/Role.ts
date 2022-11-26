import { getModelForClass, modelOptions } from '@typegoose/typegoose';
import type { Types } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';

@ObjectType()
@modelOptions({ options: { customName: 'role' }, existingConnection: getMongo(), schemaOptions: { timestamps: true } })
export class RoleSchema {
  public createdAt?: Date;
  public updatedAt?: Date;

  @Field(() => String)
  public _id!: Types.ObjectId;
}

export const RoleModel = getModelForClass(RoleSchema);
