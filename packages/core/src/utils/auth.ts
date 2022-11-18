import type { AuthChecker } from 'type-graphql';
import type { Context } from '../orm';

export const authChecker: AuthChecker<Context> = ({ context }) => {
  if (!context.user) return false;

  return true;
};
