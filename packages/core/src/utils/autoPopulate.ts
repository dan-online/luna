import type { GraphQLResolveInfo } from 'graphql';
import type { Document } from 'mongoose';

export async function autoPopulate<T extends Document>(doc: T, info: GraphQLResolveInfo, path?: string) {
  const selections = info?.fieldNodes[0]?.selectionSet?.selections;

  if (selections) {
    if (path) {
      const sel = selections.find((selection) => 'name' in selection && selection.name.value === path);

      if (sel) {
        if ('selectionSet' in sel) {
          if (sel.selectionSet?.selections) {
            for (const selection of sel.selectionSet.selections) {
              if ('name' in selection) {
                await doc.populate(selection.name.value);
              }
            }
          }
        }
      }
    } else {
      for (const selection of selections) {
        if ('name' in selection) {
          await doc.populate(selection.name.value);
        }
      }
    }
  }

  return doc;
}
