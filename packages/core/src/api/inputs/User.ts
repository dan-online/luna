import { MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @MinLength(3)
  @Field()
  public name!: string;

  @Field()
  public email!: string;

  @Field()
  public birthday!: Date;

  @Field()
  public password!: string;

  @Field()
  public username!: string;

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
