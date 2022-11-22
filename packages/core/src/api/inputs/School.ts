import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateSchoolInput {
  @Field()
  public name!: string;
}
