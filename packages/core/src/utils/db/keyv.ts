import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import KeyvRedis from "@keyv/redis";
import Keyv from "keyv";
import { getRedis } from "./redis";
export function getKeyVRedis() {
	const keyv = new Keyv({ store: new KeyvRedis(getRedis()) });

	keyv.addListener("error", () => {});

	const adapter = new KeyvAdapter(keyv);

	return adapter;
}
