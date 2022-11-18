import type { BaseContext } from '@apollo/server';
import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env';

import { SchoolModel, SchoolSchema } from './models/School.model';
import { UserModel, UserSchema } from './models/User.model';

export interface Context extends BaseContext {
  user: UserSchema | null;
}

interface DecodedJWT {
  _id: string;
}

export const getContext: ApolloFastifyContextFunction<Context> = async (request) => {
  const token = request.headers.authorization;

  if (!token) return { user: null };

  const verified = await new Promise((r) => jwt.verify(token, env.JWT_SECRET, (_err, valid) => r(valid)));

  if (!verified) return { user: null };

  const decoded = jwt.decode(token);

  if (!decoded) return { user: null };

  const user = await UserModel.findById((decoded as DecodedJWT)._id);

  if (!user) return { user: null };

  return {
    user
  };
};

export { UserModel, UserSchema, SchoolModel, SchoolSchema };
