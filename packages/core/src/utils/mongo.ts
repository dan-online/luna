import { createConnection } from 'mongoose';
import { env } from './env';
import { log } from './log';

export const mongooseConnection = createConnection(env.MONGO_URL);

mongooseConnection.on('connected', () => {
  log.info('[mongo] connected successfully');
});

mongooseConnection.on('error', (err) => {
  log.error(`[mongo] error: ${err.message}`);
});
