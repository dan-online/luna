import { GraphQLError } from "graphql";
import type { MiddlewareFn } from "type-graphql";
import type { UserSchema } from "../../orm";
import type { Context, DocType } from "../../utils/context";

export const SelfGuard: MiddlewareFn<Context> = async ({ context, root }, next) => {
	const { user } = context;
	const typedRoot = root as DocType<UserSchema>;

	if (user) {
		if (typedRoot._id.equals(user._id)) {
			return next();
		}
	}

	throw new GraphQLError("You are not authorized to perform this action", {
		extensions: {
			code: "FORBIDDEN",
		},
	});
};
