import type { ResolverData } from "type-graphql";

import { GraphQLError } from "graphql";
import { getGraphQLRateLimiter, RedisStore } from "graphql-rate-limit";
import type { Context } from "vm";
import { getRedis } from "../../utils/db/redis";

const redisStore = new RedisStore(getRedis());

export default function RateLimit(
	{
		window,
		max,
	}: {
		window?: string;
		max?: number;
		limitByVariables?: boolean;
		errorMessage?: string;
	} = {
		window: "1s",
		max: 1,
		limitByVariables: true,
	},
) {
	const rateLimiter = getGraphQLRateLimiter({
		identifyContext: (context: Context) => (context.user ? `user:${String(context.user._id)}` : `ip:${context.request.socket.remoteAddress}`),
		store: redisStore,
	});

	return async ({ root, args, context, info }: ResolverData<Context>, next: () => void) => {
		if (process.env.NODE_ENV === "test") return next();

		const errorMessage = await rateLimiter({ parent: root, args, context, info }, { max, window });

		if (errorMessage) {
			throw new GraphQLError(errorMessage, {
				extensions: {
					code: "RATELIMIT",
				},
			});
		}

		return next();
	};
}
