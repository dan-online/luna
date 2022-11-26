import { Mongoose } from 'mongoose';
import { env } from './env';
import { log } from './log';

let instance: Mongoose | undefined;

export const getMongo = () => {
  if (instance) return instance.connection;

  instance = new Mongoose();

  instance.connection.on('connected', () => {
    log.info('[mongo] connected successfully');
  });

  instance.connection.on('disconnected', () => {
    log.error(`[mongo] disconnected`);
  });

  instance.connection.on('error', (err) => {
    if (!err.message.includes('ECONNREFUSED')) {
      log.error(`[mongo] error: ${err.message}`);
    } // Handled on line 31
  });

  const connect = async () => {
    try {
      await new Promise((res, rej) => {
        instance!.connect(env.MONGO_URL, { serverSelectionTimeoutMS: 2000, connectTimeoutMS: 2000, socketTimeoutMS: 2000 }, (err) => {
          if (err) rej(err);
          else res(0);
        });
      });
    } catch {
      log.warn(`[mongo] failed to connect, attempting to reconnect in 2s`);
      setTimeout(connect, 2000);
    }
  };

  void connect();

  return instance.connection;
};
