import type { GraphQLResolveInfo } from 'graphql';
import type { Document } from 'mongoose';

export async function autoPopulate<T extends Document>(doc: T, info: GraphQLResolveInfo) {
  const selections = info?.fieldNodes[0]?.selectionSet?.selections;

  if (selections) {
    for (const selection of selections) {
      if ('name' in selection) {
        await doc.populate(selection.name.value);
      }
    }
  }

  return doc;
}
