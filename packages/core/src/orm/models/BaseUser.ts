import { prop, type DocumentType } from '@typegoose/typegoose';
import { compare, genSalt, hash } from 'bcrypt';
import { IsAscii, IsDate, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { sign } from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { Field, ObjectType, UseMiddleware } from 'type-graphql';
import { SelfGuard } from '../../api/guards/SelfGuard';
import { env } from '../../utils/env';
import { randomKey } from '../../utils/randomKey';
import type { UserSchema } from './User';

@ObjectType()
export class BaseUser {
  public createdAt?: Date;
  public updatedAt?: Date;

  @Field()
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

  @IsString()
  @IsEmail()
  @MaxLength(120)
  @MinLength(3)
  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ default: false })
  public verifiedEmail!: boolean;

  @prop({ default: randomKey() })
  public emailVerificationCode?: string;

  @prop({ required: true })
  private password!: string;

  public async hashPassword(this: DocumentType<BaseUser>, password: string) {
    const salt = await genSalt();

    this.password = await hash(password, salt);
  }

  public checkPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  public getToken(this: DocumentType<UserSchema>): string {
    return sign({ user: this._id }, env.SECRET, { expiresIn: env.NODE_ENV === 'development' ? '1y' : '7d' });
  }
}
