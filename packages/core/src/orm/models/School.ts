import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import type { Types } from "mongoose";
import dns from "node:dns/promises";
import { Authorized, Field, ObjectType, UseMiddleware } from "type-graphql";
import { SchoolGuard } from "../../api/guards/SchoolOwner";
import { getMongo } from "../../utils/mongo";
import { randomKey } from "../../utils/randomKey";
import { UserSchema } from "./User";

@ObjectType()
@modelOptions({ options: { customName: 'school' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class SchoolSchema {
	public createdAt?: Date;
	public updatedAt?: Date;

	@Field(() => String)
	public _id!: Types.ObjectId;

	@Field()
  @prop({ unique: true, required: true })
	public name!: string;

	@UseMiddleware(SchoolGuard)
  @Authorized()
  @Field()
  @prop({ unique: true, required: true })
	public domain!: string;

	@UseMiddleware(SchoolGuard)
  @Authorized()
  @Field()
  @prop({ default: false })
	public verifiedDomain!: boolean;

	@UseMiddleware(SchoolGuard)
  @Authorized()
  @Field()
  @prop({ default: randomKey() })
	public domainVerificationCode?: string;

	@UseMiddleware(SchoolGuard)
  @Field(() => [UserSchema])
  @Authorized()
  @prop({ ref: () => UserSchema, default: [] })
	public owners!: Ref<UserSchema>[];

	public async verifyDomain() {
		if (!this.domain) return false;

		let records = [];

		dns.setServers(["1.1.1.1", "2606:4700:4700::1111", "1.0.0.1", "2606:4700:4700::1001", "8.8.8.8", "8.8.4.4"]);

		try {
			records = await dns.resolveTxt(this.domain);
		} catch {
			return false;
		}

		if (records.length === 0) return false;
		if (records.flatMap((a) => a).find((record) => record === `luna-domain-verification=${this.domainVerificationCode}`)) {
			this.verifiedDomain = true;
			return true;
		}

		return false;
	}
}

export const SchoolModel = getModelForClass(SchoolSchema);
