import type { GraphQLResolveInfo } from 'graphql';

export function autoProjection(info: GraphQLResolveInfo) {
  const obj: { [key: string]: 1 } = {};
  const selections = info?.fieldNodes[0]?.selectionSet?.selections;

  if (selections) {
    for (const selection of selections) {
      if ('name' in selection) {
        obj[selection.name.value] = 1;
      }
    }
  }

  return obj;
}
