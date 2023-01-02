import { prop, type DocumentType } from '@typegoose/typegoose';
import { IsAscii, IsDate, IsString, MaxLength, MinLength } from 'class-validator';
import { createSigner } from 'fast-jwt';

import type { Types } from 'mongoose';
import { Field, ObjectType, UseMiddleware } from 'type-graphql';
import { SelfGuard } from '../../api/guards/SelfGuard';
import { env } from '../../utils/env';
import type { UserSchema } from './User';

const year = 1000 * 60 * 60 * 24 * 365;
const week = (year / 365) * 7; // felt repetitive to write 1000 * 60 * 60 * 24 * 7
const sign = createSigner({ key: env.SECRET, expiresIn: env.NODE_ENV === 'development' ? year : week });

@ObjectType()
export class BaseUser {
  public createdAt?: Date;
  public updatedAt?: Date;

  @Field(() => Date)
  @prop({ default: () => new Date() })
  public lastLogin?: Date;

  @Field(() => String)
  public _id!: Types.ObjectId;

  @UseMiddleware(SelfGuard)
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @prop({ required: true })
  @Field()
  public firstName!: string;

  @UseMiddleware(SelfGuard)
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @prop({ required: true })
  @Field()
  public middleName!: string;

  @UseMiddleware(SelfGuard)
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @prop({ required: true })
  @Field()
  public lastName!: string;

  @IsDate()
  @prop({ required: true })
  public birthday!: Date;

  public getToken(this: DocumentType<UserSchema>): string {
    return sign({ user: this._id });
  }
}
