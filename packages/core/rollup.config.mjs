import { resolve } from 'path';
import cleaner from 'rollup-plugin-cleaner';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: './dist',
      format: 'cjs',
      sourcemap: false,
      indent: false,
      interop: 'esModule'
    }
  ],
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
  plugins: [cleaner({ targets: ['./dist'] }), typescript({ tsconfig: resolve(process.cwd(), 'src', 'tsconfig.json'), check: false })],
  treeshake: false
};
