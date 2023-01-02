import type { AuthChecker } from "type-graphql";
import type { Context } from "./context";

export const authChecker: AuthChecker<Context> = ({ context }) => {
	if (!context.user) return false;

	return true;
};
