import type { BaseContext } from '@apollo/server';
import type { BeAnObject } from '@typegoose/typegoose/lib/types';
import type { FastifyRequest } from 'fastify';
import type { Document, Types } from 'mongoose';
import type { UserSchema } from '../orm';

export type DocType<T> = Document<Types.ObjectId, BeAnObject, T> & T;
export interface Context<User = DocType<UserSchema> | null> extends BaseContext {
  user: User;
  request: FastifyRequest;
}
