import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IsAscii, IsEmail, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';
import { Omit } from '../../utils/omit';
import { BaseUser } from './BaseUser';

/**
 * Todo: middleware for only student and admins to view
 */
@ObjectType()
@modelOptions({ options: { customName: 'academic' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class AcademicSchema extends Omit(BaseUser, ['email']) {
  @IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @prop()
  public preferredName?: string;

  @IsString({ each: true })
  @IsAscii({ each: true })
  @IsEmail({ each: true })
  @MaxLength(120, { each: true })
  @MinLength(3, { each: true })
  @prop({ default: [], type: [String] })
  public emails!: string[];

  @IsString({ each: true })
  @IsPhoneNumber(undefined, { each: true }) // +44 1234 567890
  @prop({ default: [], type: [String] })
  public phoneNumbers!: string[];

  @IsString()
  @IsAscii()
  @prop()
  public address?: string;

  @IsString()
  @IsAscii()
  @prop()
  public citizenship?: string;

  @IsString({ each: true })
  @IsAscii({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(2, { each: true })
  @prop({ default: [], type: [String] })
  public languages!: string[];
}

export const AcademicModel = getModelForClass(AcademicSchema);
