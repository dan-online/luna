import { DocumentType, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { compare, genSalt, hash } from 'bcrypt';
import { IsAscii, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';
import { randomKey } from '../../utils/randomKey';
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

  public async hashPassword(this: DocumentType<UserSchema>, password: string) {
    const salt = await genSalt();

    this.password = await hash(password, salt);
  }

  public checkPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export const UserModel = getModelForClass(UserSchema);
