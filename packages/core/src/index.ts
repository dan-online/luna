import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { SchoolResolver } from './api/resolvers/School';
import { UserResolver } from './api/resolvers/User';
import { getContext } from './orm';
import { authChecker } from './utils/auth';
import type { Context } from './utils/context';
import { env, envToLogger } from './utils/env';
import { formatError } from './utils/formatError';

const start = async () => {
  const fastifyServer = Fastify({
    logger: envToLogger[env.NODE_ENV]
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, SchoolResolver],
    authChecker
  });

  const apollo = new ApolloServer<Context>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
    formatError,
    introspection: env.NODE_ENV === 'development'
  });

  await apollo.start();

  await fastifyServer.register(fastifyApollo(apollo), {
    context: getContext
  });

  fastifyServer.get('/', () => {
    return { hello: 'world' };
  });

  await fastifyServer.listen({ port: env.PORT });
};

void start();
