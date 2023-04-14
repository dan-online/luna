import Redis, { type RedisOptions as Options } from "ioredis";
import { addExitHandler } from "../dev/catchExit";
import { env } from "../dev/env";
import { log } from "../dev/log";

export const RedisOptions: Options = {
	host: env.REDIS_HOST,
	port: 6379,
	lazyConnect: true,
};

let instance: Redis | null = null;

export function getRedis() {
	if (instance) {
		return instance;
	}

	const redis = new Redis(RedisOptions);
	let registeredDisconnect = false;

	addExitHandler(() => redis.quit());

	redis.addListener("connect", () => {
		log.info("[redis] connected successfully");
		registeredDisconnect = false;
	});

	redis.addListener("error", (err) => {
		if (err.code !== "ECONNREFUSED") {
			log.error(`[redis] error: ${err.message}`);
		} // Handled on line 35
	});

	redis.addListener("close", () => {
		if (!registeredDisconnect) {
			log.warn("[redis] disconnected");
		}

		registeredDisconnect = true;
	});

	const connect = async () => {
		try {
			await redis.connect();
		} catch {
			if (redis.status !== "ready" && redis.status !== "connect") {
				log.warn("[redis] failed to connect, attempting to reconnect in 2s");
				setTimeout(connect, 2000);
			}
		}
	};

	void connect();

	instance = redis;

	return redis;
}
