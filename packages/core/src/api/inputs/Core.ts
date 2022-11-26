import { Max, Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
@InputType()
export class PaginationInput {
  @Max(100)
  @Min(10)
  @Field(() => Int)
  public limit?: number;

  @Min(1)
  @Field(() => Int)
  public page?: number;
}
