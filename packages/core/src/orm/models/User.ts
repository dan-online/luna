import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IsAscii, IsString, MaxLength, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';
import { BaseUser } from './BaseUser';
/**
 * @description This user schema is used for authentication and authorization of Admins, they are not the same as Students or teachers etc
 */
@ObjectType()
@modelOptions({ options: { customName: 'user' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class UserSchema extends BaseUser {
  @IsString()
  @IsAscii()
  @MinLength(3)
  @MaxLength(24)
  @Field()
  @prop({ unique: true, required: true })
  public username!: string;
}

export const UserModel = getModelForClass(UserSchema);
