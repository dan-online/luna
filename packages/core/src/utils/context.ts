import type { BaseContext } from '@apollo/server';
import type { BeAnObject } from '@typegoose/typegoose/lib/types';
import type { FastifyRequest } from 'fastify';
import type { Document, Types } from 'mongoose';
import type { UserSchema } from '../orm';
import type { BaseUser } from '../orm/models/BaseUser';

export type DocType<T> = Document<Types.ObjectId, BeAnObject, T> & T;
export interface Context<T extends DocType<BaseUser> = DocType<UserSchema>> extends BaseContext {
  user: T | null;
  request: FastifyRequest;
}
