import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import { verify } from 'jsonwebtoken';
import type { Context } from '../utils/context';
import { env } from '../utils/env';

import { SchoolModel, SchoolSchema } from './models/School';
import { UserModel, UserSchema } from './models/User';

interface DecodedJWT {
  user: string;
}

const getContext: ApolloFastifyContextFunction<Context> = async (request) => {
  const token = request.headers.authorization;

  if (!token) return { user: null, request };

  const verified = verify(token, env.SECRET);

  if (!verified) return { user: null, request };

  const user = await UserModel.findById((verified as DecodedJWT).user);

  if (!user) return { user: null, request };

  return {
    user,
    request
  };
};

export { UserModel, UserSchema, SchoolModel, SchoolSchema, getContext };
