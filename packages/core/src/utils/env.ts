import { envSchema } from 'env-schema';

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    }
  }
};

export const env = envSchema<{ PORT: number }>({
  schema,
  dotenv: true
});
