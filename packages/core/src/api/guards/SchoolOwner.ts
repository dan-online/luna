import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import type { MiddlewareFn } from "type-graphql";
import type { SchoolSchema } from "../../orm";
import type { Context, DocType } from "../../utils/context";

export const SchoolGuard: MiddlewareFn<Context> = async ({ context, root }, next) => {
	const { user } = context;
	const typedRoot = root as DocType<SchoolSchema>;

	if (user && typedRoot) {
		if (
			typedRoot.owners.find((owner) => {
				if (!owner) return false;
				if (owner instanceof Types.ObjectId) {
					return owner.equals(user._id);
				}

				return owner._id.equals(user._id);
			})
		) {
			return next();
		}
	}

	throw new GraphQLError("You are not authorized to perform this action", {
		extensions: {
			code: "FORBIDDEN",
		},
	});
};
