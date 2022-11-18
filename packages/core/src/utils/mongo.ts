import { createConnection } from 'mongoose';
import { env } from './env';

export const mongooseConnection = createConnection(env.MONGO_URL);
