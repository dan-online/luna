import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './api/resolvers/User.resolver';
import { Context, getContext } from './orm';
import { authChecker } from './utils/auth';
import { env, envToLogger } from './utils/env';
import { formatError } from './utils/formatError';

const start = async () => {
  const fastifyServer = Fastify({
    logger: envToLogger[env.NODE_ENV]
  });

  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker
  });

  const apollo = new ApolloServer<Context>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
    formatError
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
