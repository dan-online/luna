import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { SchoolModel, SchoolSchema, UserSchema } from '../../orm';
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
    @Ctx() { user }: Context<DocType<UserSchema>>
  ): Promise<CreateSchoolOutput> {
    if (!user.verifiedEmail) {
      throw new GraphQLError('You must verify your email before creating a school', {
        extensions: {
          code: 'UNVERIFIED_EMAIL'
        }
      });
    }

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

  @Query(() => SchoolSchema)
  @Authorized()
  public async school(
    @Arg('school') schoolId: string,
    @Ctx() { user }: Context<DocType<SchoolSchema>>,
    @Info() info: GraphQLResolveInfo
  ): Promise<DocType<SchoolSchema>> {
    const school = await SchoolModel.findOne({ owners: user._id, _id: schoolId }, autoProjection(info));

    if (!school) {
      throw new GraphQLError('School not found', {
        extensions: {
          code: 'NOT_FOUND'
        }
      });
    }

    return autoPopulate<DocType<SchoolSchema>>(school, info);
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async deleteSchool(@Arg('school') _id: string, @Ctx() { user }: Context<DocType<SchoolSchema>>): Promise<boolean> {
    const school = await SchoolModel.findOne({ _id, owners: user._id });

    if (!school) {
      throw new GraphQLError('School not found', {
        extensions: {
          code: 'NOT_FOUND'
        }
      });
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
