import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  public firstName!: string;

  @Field()
  public middleName!: string;

  @Field()
  public lastName!: string;

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
