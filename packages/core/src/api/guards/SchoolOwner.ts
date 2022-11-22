import { GraphQLError } from 'graphql';
import type { MiddlewareFn } from 'type-graphql';
import type { SchoolSchema } from '../../orm';
import type { Context, DocType } from '../../utils/context';

export const SchoolGuard: MiddlewareFn<Context> = async ({ context, root }, next) => {
  const { user } = context;
  const typedRoot = root as DocType<SchoolSchema>;

  if (user) {
    if (typedRoot.owners.find((owner) => owner && owner._id.equals(user._id))) {
      return next();
    }
  }

  throw new GraphQLError('You are not authorized to perform this action', {
    extensions: {
      code: 'FORBIDDEN'
    }
  });
};
