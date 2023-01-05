import { IsAscii, IsDateString, IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {
	@IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Field()
	public firstName!: string;

	@IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Field()
	public middleName!: string;

	@IsAscii()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Field()
	public lastName!: string;

	@IsAscii()
  @IsString()
  @IsEmail()
  @MaxLength(320)
  @MinLength(3)
  @Field()
	public email!: string;

	@Field()
  @IsDateString()
	public birthday!: string;

	@IsStrongPassword() // may remove
  @IsAscii()
  @IsString()
  @Field()
	public password!: string;

	@IsString()
  @IsAscii()
  @MinLength(3)
  @MaxLength(24)
  @Field()
	public username!: string;

	@IsString()
  @Field({ nullable: process.env.NODE_ENV !== 'production' })
	public captcha?: string;
}

@InputType()
export class LoginInput {
	@Field()
	public email!: string;

	@Field()
	public password!: string;

	@Field({ nullable: process.env.NODE_ENV !== 'production' })
	public captcha?: string;
}
