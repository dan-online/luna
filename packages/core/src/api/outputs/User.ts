import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class RegisterOutput {
  @Field(() => String)
  public token!: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  public token!: string;
}
