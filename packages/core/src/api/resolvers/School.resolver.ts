import { Resolver } from 'type-graphql';
import { SchoolSchema } from '../../orm';

@Resolver(() => SchoolSchema)
export class SchoolResolver {
  public hello(): string {
    return 'Hello World!';
  }
}
