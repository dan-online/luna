import type { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Base {
	public createdAt?: Date;
	public updatedAt?: Date;

	@Field(() => String)
	public _id!: Types.ObjectId;
}
