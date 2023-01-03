import type { GraphQLResolveInfo, SelectionNode } from "graphql";

// If this is what it takes
export function autoProjection(info: GraphQLResolveInfo, path: string[] = [], def = {}) {
	const obj: { [key: string]: 1 } = def;
	const selections = info?.fieldNodes[0]?.selectionSet?.selections;

	if (!selections) return obj;

	const projectSelection = (sels: readonly SelectionNode[]) => {
		for (const selection of sels) {
			if ("name" in selection) {
				obj[selection.name.value] = 1;
			}
		}
	};

	if (path.length < 1) {
		projectSelection(selections);
	} else {
		for (const p of path) {
			const sel = selections.find((selection) => "name" in selection && selection.name.value === p);

			if (sel && "selectionSet" in sel && sel.selectionSet?.selections) {
				projectSelection(sel.selectionSet.selections);
			}
		}
	}

	return obj;
}
