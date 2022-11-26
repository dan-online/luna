import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IsAscii, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';
import { Omit } from '../../utils/omit';
import { BaseUser } from './BaseUser';

@ObjectType()
class Socials {
  @IsString()
  @IsAscii()
  @MaxLength(120)
  @MinLength(1)
  public linkedin?: string;

  @IsString()
  @IsAscii()
  @MaxLength(120)
  @MinLength(1)
  public facebook?: string;

  @IsString()
  @IsAscii()
  @MaxLength(120)
  @MinLength(1)
  public twitter?: string;
}

/**
 * Todo:
 * Middleware for only student and admins to view
 * Roles
 */
@ObjectType()
@modelOptions({ options: { customName: 'academic' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class AcademicSchema extends Omit(BaseUser, ['email']) {
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Field()
  @prop()
  public preferredName?: string;

  @IsString({ each: true })
  @IsAscii({ each: true })
  @IsEmail({ each: true })
  @MaxLength(120, { each: true })
  @MinLength(3, { each: true })
  @Field(() => [String])
  @prop({ default: [], type: [String] })
  public emails!: string[];

  @IsString({ each: true })
  @IsPhoneNumber(undefined, { each: true }) // +44 1234 567890
  @Field(() => [String])
  @prop({ default: [], type: [String] })
  public phoneNumbers!: string[];

  @IsString()
  @IsAscii()
  @Field()
  @prop()
  public address?: string;

  @IsString()
  @IsAscii()
  @Field()
  @prop()
  public citizenship?: string;

  @IsString({ each: true })
  @IsAscii({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(2, { each: true })
  @Field(() => [String])
  @prop({ default: [], type: [String] })
  public languages!: string[];

  @Field()
  @prop({ default: {} })
  public socials?: Socials;
}

export const AcademicModel = getModelForClass(AcademicSchema);
