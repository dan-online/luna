import { resolve } from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  minify: false,
  clean: true,
  external: [
    'type-graphql',
    'env-schema',
    '@apollo/server',
    '@apollo/server/errors',
    'reflect-metadata',
    '@as-integrations/fastify',
    'fastify',
    '@typegoose/typegoose',
    'class-validator',
    'jsonwebtoken',
    'mongoose',
    'bcrypt',
    'graphql',
    'graphql-rate-limit',
    'ioredis',
    'pino'
  ],
  format: 'cjs',
  tsconfig: resolve(process.cwd(), 'src', 'tsconfig.json')
});
