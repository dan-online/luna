import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CreateSchoolOutput {
  @Field(() => String)
  public _id!: string;
}
