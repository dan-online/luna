import { Field, ObjectType } from "type-graphql";
import { SchoolSchema } from "../../orm";

import { PaginatedOutput } from "./Paginated";

@ObjectType()
export class CreateSchoolOutput {
	@Field(() => String)
	public _id!: string;
}

@ObjectType()
export class SchoolsOutput extends PaginatedOutput {
	@Field(() => [SchoolSchema])
	public schools!: SchoolSchema[];
}
