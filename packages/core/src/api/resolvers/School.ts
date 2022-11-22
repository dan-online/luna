import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { SchoolModel, SchoolSchema } from '../../orm';
import type { Context, DocType } from '../../utils/context';
import { CreateSchoolInput } from '../inputs/School';
import { CreateSchoolOutput } from '../outputs/School';

@Resolver(() => SchoolSchema)
export class SchoolResolver {
  @Mutation(() => CreateSchoolOutput)
  @Authorized()
  public async createSchool(
    @Arg('school') schoolInput: CreateSchoolInput,
    @Ctx() { user }: Context<DocType<SchoolSchema>>
  ): Promise<CreateSchoolOutput> {
    const newSchool = new SchoolModel({
      name: schoolInput.name,
      domain: schoolInput.domain,
      owners: [user._id]
    });

    const doc = await newSchool.save();

    return {
      _id: doc._id.toString()
    };
  }
}
