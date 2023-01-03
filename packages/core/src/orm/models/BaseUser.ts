import { prop, type DocumentType } from "@typegoose/typegoose";
import { createSigner } from "fast-jwt";

import { Field, ObjectType, UseMiddleware } from "type-graphql";
import { SelfGuard } from "../../api/guards/SelfGuard";
import { env } from "../../utils/dev/env";
import { validateAscii, validateDate, validateString, validateStrLength } from "../../utils/validate";
import { Base } from "./Base";
import type { UserSchema } from "./User";

const year = 1000 * 60 * 60 * 24 * 365;
const week = (year / 365) * 7; // felt repetitive to write 1000 * 60 * 60 * 24 * 7
const sign = createSigner({
	key: env.SECRET,
	expiresIn: env.NODE_ENV === "development" ? year : week,
});

@ObjectType()
export class BaseUser extends Base {
	@Field(() => Date)
  @prop({ default: () => new Date() })
	public lastLogin!: Date; // Possibly change to array of last 5 logins with User Agents

	@UseMiddleware(SelfGuard)
  @prop({ required: true, validate: [validateAscii, validateString, validateStrLength(3, 120)] })
  @Field()
	public firstName!: string;

	@UseMiddleware(SelfGuard)
  @prop({ required: true, validate: [validateAscii, validateString, validateStrLength(3, 120)] })
  @Field()
	public middleName!: string;

	@UseMiddleware(SelfGuard)
  @prop({ required: true, validate: [validateAscii, validateString, validateStrLength(3, 120)] })
  @Field()
	public lastName!: string;

	@prop({ required: true, validate: [validateDate]})
	public birthday!: Date;

	public getToken(this: DocumentType<UserSchema>): string {
		return sign({ user: this._id });
	}
}
