import { Query, Resolver } from 'type-graphql';

@Resolver()
export class SchoolResolver {
  @Query(() => [String])
  public schools(): string[] {
    return [];
  }
}
