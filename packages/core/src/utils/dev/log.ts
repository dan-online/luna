import pino from "pino";
import { env, envToLogger } from "./env";
export const log = pino(envToLogger[env.NODE_ENV] || {});
