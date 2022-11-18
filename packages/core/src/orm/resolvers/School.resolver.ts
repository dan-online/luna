import { Query, Resolver } from 'type-graphql';
import { SchoolModel } from '../models/School.model';

@Resolver()
export class SchoolResolver {
  @Query(() => Number)
  public async numberOfSchools(): Promise<number> {
    const size = await SchoolModel.countDocuments({});

    return size;
  }
}
