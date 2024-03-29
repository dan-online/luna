import type { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { createVerifier } from "fast-jwt";

import type { Context } from "../utils/dev/context";
import { env } from "../utils/dev/env";

import { AcademicModel, AcademicSchema } from "./models/Academic";
import { SchoolModel, SchoolSchema } from "./models/School";
import { UserModel, UserSchema } from "./models/User";

const verify = createVerifier({ key: env.SECRET, cache: true });

interface DecodedJWT {
	user: string;
}

const getContext: ApolloFastifyContextFunction<Context> = async (request) => {
	const token = request.headers.authorization;

	if (!token) return { user: null, request };

	const verified = verify(token);

	if (!verified) return { user: null, request };

	const user = await UserModel.findById((verified as DecodedJWT).user);

	if (!user) return { user: null, request };

	return {
		user,
		request,
	};
};

export { UserModel, UserSchema, SchoolModel, SchoolSchema, getContext, AcademicSchema, AcademicModel };
