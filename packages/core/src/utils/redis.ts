import Redis, { RedisOptions as Options } from 'ioredis';
import { log } from './log';

export const RedisOptions: Options = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  lazyConnect: true
};

let instance: Redis | null = null;

export function getRedis() {
  if (instance) {
    return instance;
  }

  const redis = new Redis(RedisOptions);

  redis.addListener('connect', () => {
    log.info(`[redis] connected successfully`);
  });

  redis.addListener('error', (err) => {
    if (err.code !== 'ECONNREFUSED') {
      log.error(`[redis] error: ${err.message}`);
    } // Handled on line 36
  });

  const connect = async () => {
    try {
      await redis.connect();
    } catch {
      log.warn(`[redis] failed to connect, attempting to reconnect in 2s`);
      setTimeout(connect, 2000);
    }
  };

  void connect();

  instance = redis;

  return redis;
}
