import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { getContext } from './orm';
import { SchoolResolver } from './orm/resolvers/School.resolver';
import { authChecker } from './utils/auth';
import { env, envToLogger } from './utils/env';

const start = async () => {
  const fastifyServer = Fastify({
    logger: envToLogger[env.NODE_ENV]
  });

  const schema = await buildSchema({
    resolvers: [SchoolResolver],
    authChecker
  });

  const apollo = new ApolloServer<BaseContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastifyServer)]
  });

  await apollo.start();

  await fastifyServer.register(fastifyApollo(apollo), {
    // @ts-expect-error 2769 - This is a bug in the type definitions
    context: getContext
  });

  fastifyServer.get('/', () => {
    return { hello: 'world' };
  });

  await fastifyServer.listen({ port: env.PORT });
};

void start();
