import { envSchema } from 'env-schema';

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: process.env.NODE_ENV === 'test' ? 5000 : 3000
    },
    LOG_LEVEL: {
      type: 'string',
      default: process.env.NODE_ENV === 'test' ? 'error' : 'info'
    },
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    MONGO_URL: {
      type: 'string',
      default: 'mongodb://127.0.0.1:27017/luna'
    },
    SECRET: {
      type: 'string',
      default: 'supersecret'
    },
    GOOGLE_CLIENT_ID: {
      type: 'string',
      default: ''
    },
    GOOGLE_CLIENT_SECRET: {
      type: 'string',
      default: ''
    },
    GOOGLE_REDIRECT_URI: {
      type: 'string',
      default: ''
    },
    REDIS_HOST: {
      type: 'string',
      default: 'localhost'
    }
  }
};

export const env = envSchema<{
  PORT: number;
  LOG_LEVEL: string;
  NODE_ENV: 'production' | 'development' | 'test';
  MONGO_URL: string;
  SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  REDIS_HOST: string;
}>({
  schema,
  dotenv: true
});

export const envToLogger = {
  development: {
    level: env.LOG_LEVEL,
    redact: ['req.headers.authorization'],
    transport: {
      target: '@fastify/one-line-logger',
      options: {
        colorize: true,
        ignore: 'pid,hostname,time'
      }
    }
  },
  production: true,
  test: {
    level: env.LOG_LEVEL
  }
};
