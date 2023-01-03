import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import type { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import { getMongo } from "../../utils/db/mongo";
import { UserSchema } from "./User";

@ObjectType()
@modelOptions({ options: { customName: 'role' }, existingConnection: getMongo(), schemaOptions: { timestamps: true } })
export class RoleSchema {
	public createdAt?: Date;
	public updatedAt?: Date;

	@Field()
  @prop({ required: true, ref: () => UserSchema })
	public lastEditedBy!: Ref<UserSchema>;

	@Field(() => String)
	public _id!: Types.ObjectId;
}

export const RoleModel = getModelForClass(RoleSchema);
