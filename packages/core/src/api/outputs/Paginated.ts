import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class PaginatedOutput {
  @Field(() => Int)
  public total!: number;
}
