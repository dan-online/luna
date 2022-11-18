import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { SchoolResolver } from './resolvers/School.resolver';
import { env, envToLogger } from './utils/env';

const start = async () => {
  const fastifyServer = Fastify({
    logger: envToLogger[env.NODE_ENV]
  });

  const schema = await buildSchema({
    resolvers: [SchoolResolver]
  });

  const apollo = new ApolloServer<BaseContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastifyServer)]
  });

  await apollo.start();

  await fastifyServer.register(fastifyApollo(apollo));

  await fastifyServer.listen({ port: env.PORT });
};

void start();
