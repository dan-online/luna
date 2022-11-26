import type { GraphQLResolveInfo } from 'graphql';

// If this is what it takes
export function autoProjection(info: GraphQLResolveInfo, path?: string) {
  const obj: { [key: string]: 1 } = {};
  const selections = info?.fieldNodes[0]?.selectionSet?.selections;

  if (selections) {
    if (path) {
      const sel = selections.find((selection) => 'name' in selection && selection.name.value === path);

      if (sel) {
        if ('selectionSet' in sel) {
          if (sel.selectionSet?.selections) {
            for (const selection of sel.selectionSet.selections) {
              if ('name' in selection) {
                obj[selection.name.value] = 1;
              }
            }
          }
        }
      }
    } else {
      for (const selection of selections) {
        if ('name' in selection) {
          obj[selection.name.value] = 1;
        }
      }
    }
  }

  return obj;
}
