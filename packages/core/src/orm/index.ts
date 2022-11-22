import type { BaseContext } from '@apollo/server';
import type { ApolloFastifyContextFunction } from '@as-integrations/fastify';
import type { BeAnObject } from '@typegoose/typegoose/lib/types';
import type { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import type { Document, Types } from 'mongoose';
import { env } from '../utils/env';

import { SchoolModel, SchoolSchema } from './models/School.model';
import { UserModel, UserSchema } from './models/User.model';

export type UserType = Document<Types.ObjectId, BeAnObject, UserSchema> & UserSchema;

export interface Context<User = UserType | null> extends BaseContext {
  user: User;
  request: FastifyRequest;
}

interface DecodedJWT {
  user: string;
}

export const getContext: ApolloFastifyContextFunction<Context> = async (request) => {
  const token = request.headers.authorization;

  if (!token) return { user: null, request };

  const verified = jwt.verify(token, env.SECRET);

  if (!verified) return { user: null, request };

  const user = await UserModel.findById((verified as DecodedJWT).user);

  if (!user) return { user: null, request };

  return {
    user,
    request
  };
};

export { UserModel, UserSchema, SchoolModel, SchoolSchema };
