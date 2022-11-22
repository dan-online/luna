import Redis, { RedisOptions as Options } from 'ioredis';
import { log } from './log';

export const RedisOptions: Options = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  lazyConnect: true,
  retryStrategy: (times: number) => {
    return Math.min(times * 1000, 5000);
  }
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
    log.error(`[redis] error: ${err.message}`);
  });

  void redis.connect();

  instance = redis;

  return redis;
}
