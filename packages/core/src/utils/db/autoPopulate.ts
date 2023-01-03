import type { GraphQLResolveInfo, SelectionNode } from "graphql";

export function autoPopulate(info: GraphQLResolveInfo, path: string[] = []) {
	const selections = info?.fieldNodes[0]?.selectionSet?.selections;
	const populate: string[] = [];

	if (!selections) return populate;

	const populateSelection = (sels: readonly SelectionNode[]) => {
		for (const selection of sels) {
			if ("name" in selection) {
				populate.push(selection.name.value);
			}
		}
	};

	if (path.length < 1) {
		populateSelection(selections);
	} else {
		for (const p of path) {
			const sel = selections.find((selection) => "name" in selection && selection.name.value === p);

			if (sel && "selectionSet" in sel && sel.selectionSet?.selections) {
				populateSelection(sel.selectionSet.selections);
			}
		}
	}

	return populate;
}
