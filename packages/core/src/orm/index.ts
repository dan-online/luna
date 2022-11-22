import type { BaseContext } from '@apollo/server';
import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import type { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env';

import { SchoolModel, SchoolSchema } from './models/School.model';
import { UserModel, UserSchema } from './models/User.model';

export interface Context extends BaseContext {
  user: UserSchema | null;
  request: FastifyRequest;
}

interface DecodedJWT {
  _id: string;
}

export const getContext: ApolloFastifyContextFunction<Context> = async (request) => {
  const token = request.headers.authorization;

  if (!token) return { user: null, request };

  const verified = await new Promise((r) => jwt.verify(token, env.JWT_SECRET, (_err, valid) => r(valid)));

  if (!verified) return { user: null, request };

  const decoded = jwt.decode(token);

  if (!decoded) return { user: null, request };

  const user = await UserModel.findById((decoded as DecodedJWT)._id);

  if (!user) return { user: null, request };

  return {
    user,
    request
  };
};

export { UserModel, UserSchema, SchoolModel, SchoolSchema };
