import { envSchema } from 'env-schema';

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    LOG_LEVEL: {
      type: 'string',
      default: 'info'
    },
    NODE_ENV: {
      type: 'string',
      default: 'development'
    }
  }
};

export const env = envSchema<{ PORT: number; LOG_LEVEL: string; NODE_ENV: 'production' | 'development' | 'test' }>({
  schema,
  dotenv: true
});

export const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  production: true,
  test: false
};
