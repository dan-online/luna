import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { SchoolResolver } from './api/resolvers/School';
import { UserResolver } from './api/resolvers/User';
import { getContext } from './orm';
import ConnectRouter from './routes/auth/google';
import { authChecker } from './utils/auth';
import { addExitHandler } from './utils/catchExit';
import type { Context } from './utils/context';
import { env, envToLogger } from './utils/env';
import { formatError } from './utils/formatError';
import { getKeyVRedis } from './utils/keyv';

const start = async () => {
  const fastifyServer = Fastify({
    logger: envToLogger[env.NODE_ENV]
  });

  const schema = await buildSchema({
    validate: {
      forbidUnknownValues: false
    },
    resolvers: [UserResolver, SchoolResolver],
    authChecker
  });

  const apollo = new ApolloServer<Context>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
    formatError,
    introspection: env.NODE_ENV === 'development',
    cache: getKeyVRedis()
  });

  await apollo.start();

  await fastifyServer.register(fastifyApollo(apollo), {
    context: getContext
  });

  fastifyServer.get('/', () => {
    return { hello: 'world' };
  });

  await fastifyServer.register(ConnectRouter);

  addExitHandler(() => fastifyServer.close());

  await fastifyServer.listen({ port: env.PORT });
};

void start();
