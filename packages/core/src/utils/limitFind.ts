import type { QueryWithHelpers } from "mongoose";

export const limitFind = <ResultDoc>(
	query: QueryWithHelpers<ResultDoc[], ResultDoc>,
	{ limit = 10, page = 1 }: { limit?: number; page?: number } = {
		limit: 10,
		page: 1,
	},
) => {
	return query.limit(limit).skip((page - 1) * limit);
};
