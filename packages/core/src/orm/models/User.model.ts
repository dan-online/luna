import { DocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { compare, genSalt, hash } from 'bcrypt';
import { IsAscii, IsDate, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { Field, UseMiddleware } from 'type-graphql';
import { SelfGuard } from '../../api/guards/SelfGuard';
import { env } from '../../utils/env';
import { mongooseConnection } from '../../utils/mongo';
/**
 * @description This user schema is used for authentication and authorization of Admins, they are not the same as Students or teachers etc
 */
@modelOptions({ options: { customName: 'user' }, existingConnection: mongooseConnection, schemaOptions: { timestamps: true, autoIndex: true } })
export class UserSchema {
  public _id!: Types.ObjectId;
  public createdAt?: Date;
  public updatedAt?: Date;

  @UseMiddleware(SelfGuard)
  @Field()
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @prop()
  public name!: string;

  @IsString()
  @IsAscii()
  @MinLength(3)
  @MaxLength(24)
  @prop({ unique: true })
  public username!: string;

  @IsString()
  @IsEmail()
  @MaxLength(120)
  @MinLength(3)
  @prop({ unique: true })
  public email!: string;

  @IsDate()
  @prop()
  public birthday!: Date;

  @prop()
  private password!: string;

  public async hashPassword(this: DocumentType<UserSchema>, password: string) {
    const salt = await genSalt();

    this.password = await hash(password, salt);
  }

  public checkPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  public getToken(this: DocumentType<UserSchema>): string {
    return jwt.sign({ user: this._id }, env.SECRET);
  }
}

export const UserModel = getModelForClass(UserSchema);
