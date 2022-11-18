import { resolve } from 'path';
import cleaner from 'rollup-plugin-cleaner';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs'
      // exports: 'named'
      // sourcemap: true
    }
  ],
  external: [
    'type-graphql',
    'env-schema',
    '@apollo/server',
    'reflect-metadata',
    '@as-integrations/fastify',
    'fastify',
    '@typegoose/typegoose',
    'zod',
    'jsonwebtoken'
  ],
  plugins: [cleaner({ targets: ['./dist'] }), typescript({ tsconfig: resolve(process.cwd(), 'src', 'tsconfig.json') })]
};
