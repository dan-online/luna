import type { GraphQLResolveInfo } from 'graphql';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { SchoolModel, SchoolSchema } from '../../orm';
import { autoPopulate } from '../../utils/autoPopulate';
import { autoProjection } from '../../utils/autoProject';
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

  @Query(() => [SchoolSchema])
  @Authorized()
  public async schools(@Ctx() { user }: Context<DocType<SchoolSchema>>, @Info() info: GraphQLResolveInfo): Promise<DocType<SchoolSchema>[]> {
    const schools = await SchoolModel.find({ owners: user._id }, autoProjection(info));

    for (const school of schools) {
      await autoPopulate<DocType<SchoolSchema>>(school, info);
    }

    return schools;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async deleteSchool(@Arg('school') _id: string, @Ctx() { user }: Context<DocType<SchoolSchema>>): Promise<boolean> {
    const school = await SchoolModel.findOne({ _id, owners: user._id });

    if (!school) {
      return false;
    }

    await school.delete();

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async verifyDomain(@Arg('school') _id: string, @Ctx() { user }: Context<DocType<SchoolSchema>>): Promise<boolean> {
    const school = await SchoolModel.findOne({ _id, owners: user._id });

    if (!school) {
      return false;
    }

    if (school.verifiedDomain) {
      return true;
    }

    const result = await school.verifyDomain();

    if (result) {
      await school.save();
    }

    return result;
  }
}
