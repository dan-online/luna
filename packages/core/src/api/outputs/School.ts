import { Field, Int, ObjectType } from 'type-graphql';
import { SchoolSchema } from '../../orm';

@ObjectType()
export class CreateSchoolOutput {
  @Field(() => String)
  public _id!: string;
}

@ObjectType()
export class SchoolsOutput {
  @Field(() => [SchoolSchema])
  public items!: SchoolSchema[];

  @Field(() => Int)
  public total!: number;
}
