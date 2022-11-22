import { GraphQLError } from 'graphql';
import type { MiddlewareFn } from 'type-graphql';
import type { Context } from '../../orm';

export const SelfGuard: MiddlewareFn<Context> = async ({ context, root }, next) => {
  const { user } = context;

  if (user) {
    // if (root instanceof UserSchema) {
    if (root._id.equals(user._id)) {
      return next();
    }
    // }
    // check other instance types later below
  }

  throw new GraphQLError('You are not authorized to perform this action', {
    extensions: {
      code: 'FORBIDDEN'
    }
  });
};
