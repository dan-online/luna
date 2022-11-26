import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { Arg, Authorized, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { SchoolModel, SchoolSchema, UserSchema } from '../../orm';
import { autoPopulate } from '../../utils/autoPopulate';
import { autoProjection } from '../../utils/autoProject';
import type { Context, DocType } from '../../utils/context';
import { limitFind } from '../../utils/limitFind';
import { PaginationInput } from '../inputs/Core';
import { CreateSchoolInput } from '../inputs/School';
import { CreateSchoolOutput, SchoolsOutput } from '../outputs/School';

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

  @Query(() => SchoolsOutput)
  @Authorized()
  public async schools(
    @Ctx() { user }: Context<DocType<SchoolSchema>>,
    @Info() info: GraphQLResolveInfo,
    @Arg('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<SchoolsOutput> {
    const schools = await limitFind<DocType<SchoolSchema>>(SchoolModel.find({ owners: user._id }, autoProjection(info, 'items')), pagination);
    const total = await SchoolModel.countDocuments({ owners: user._id });

    for (const school of schools) {
      await autoPopulate<DocType<SchoolSchema>>(school, info, 'items');
    }

    return {
      total,
      items: schools
    };
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
      await SchoolModel.updateOne({ _id }, { verifiedDomain: true });
    }

    return result;
  }
}
