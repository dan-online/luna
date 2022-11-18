import { Authorized, Query, Resolver } from 'type-graphql';
import { SchoolModel } from '../models/School.model';

@Resolver()
export class SchoolResolver {
  @Query(() => [String])
  @Authorized()
  public schools(): string[] {
    return SchoolModel.find({}).array();
  }
}
