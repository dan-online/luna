import { IsAscii, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateSchoolInput {
  @IsString()
  @IsAscii()
  @MinLength(3)
  @MaxLength(50)
  @Field()
  public name!: string;

  @IsUrl()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsAscii()
  @Field()
  public domain!: string;
}
