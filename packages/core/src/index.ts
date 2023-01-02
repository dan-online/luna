import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { SchoolResolver } from "./api/resolvers/School";
import { UserResolver } from "./api/resolvers/User";
import { getContext } from "./orm";
import ConnectRouter from "./routes/auth/google";
import { authChecker } from "./utils/auth";
import { addExitHandler } from "./utils/catchExit";
import type { Context } from "./utils/context";
import { env, envToLogger } from "./utils/env";
import { formatError } from "./utils/formatError";
import { getKeyVRedis } from "./utils/keyv";
import { getMongo } from "./utils/mongo";
import { getRedis } from "./utils/redis";

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
	});

	const apollo = new ApolloServer<Context>({
		schema,
		plugins: [fastifyApolloDrainPlugin(fastifyServer)],
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
