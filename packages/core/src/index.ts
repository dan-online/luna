import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { WebSocketServer } from "ws";
import { SchoolResolver } from "./api/resolvers/School.resolver";
import { UserResolver } from "./api/resolvers/User.resolver";
import { getContext } from "./orm";
import ConnectRouter from "./routes/auth/google";
import { authChecker } from "./utils/auth";
import { getKeyVRedis } from "./utils/db/keyv";
import { getMongo } from "./utils/db/mongo";
import { getRedis } from "./utils/db/redis";
import { addExitHandler } from "./utils/dev/catchExit";
import type { Context } from "./utils/dev/context";
import { env, envToLogger } from "./utils/dev/env";
import { formatError } from "./utils/dev/formatError";

const start = async () => {
	const fastifyServer = Fastify({
		logger: envToLogger[env.NODE_ENV],
	});

	const schema = await buildSchema({
		validate: {
			forbidUnknownValues: false,
		},
		resolvers: [UserResolver, SchoolResolver],
		authChecker,
		pubSub: new RedisPubSub({
			publisher: getRedis(),
			subscriber: getRedis(),
		}),
	});

	const wsServer = new WebSocketServer({
		server: fastifyServer.server,
		path: "/graphql",
	});

	const serverCleanup = useServer({ schema }, wsServer);

	const apollo = new ApolloServer<Context>({
		schema,
		plugins: [
			fastifyApolloDrainPlugin(fastifyServer),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
		formatError,
		introspection: env.NODE_ENV === "development",
		cache: getKeyVRedis(),
	});

	await apollo.start();

	await fastifyServer.register(fastifyApollo(apollo), {
		context: getContext,
	});

	fastifyServer.get("/", () => {
		return { hello: "world" };
	});

	const redis = getRedis();
	const mongo = getMongo();

	fastifyServer.get("/status", () => {
		const mongoStatus = {
			"0": "disconnected",
			"2": "connecting",
			"3": "disconnected",
			"99": "uninitialized",
		};

		if (redis.status !== "ready") return { status: redis.status };
		if (mongo.readyState !== 1) return { status: mongoStatus[mongo.readyState] };

		return { status: "ok" };
	});

	await fastifyServer.register(ConnectRouter);

	addExitHandler(() => fastifyServer.close());

	await fastifyServer.listen({ port: env.PORT });

	return fastifyServer;
};

if (process.env.NODE_ENV !== "test") {
	void start();
}

export { start };
