import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { SchoolModel, SchoolSchema } from '../../orm';
import type { DocType } from '../../utils/context';
import type { CreateSchoolInput } from '../inputs/School';

@Resolver(() => SchoolSchema)
export class SchoolResolver {
  @Mutation(() => SchoolSchema)
  @Authorized()
  public async createSchool(@Arg('school') schoolInput: CreateSchoolInput): Promise<DocType<SchoolSchema>> {
    const newSchool = new SchoolModel({});

    await newSchool.save();

    return newSchool;
  }
}
