import { type DocumentType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { compare, genSalt, hash } from "bcrypt";
import { Field, ObjectType } from "type-graphql";
import { getMongo } from "../../utils/db/mongo";
import { randomKey } from "../../utils/randomKey";
import { validateAscii, validateEmail, validateString, validateStrLength, validateUsername } from "../../utils/validate";
import { BaseUser } from "./BaseUser";

/**
 * @description This user schema is used for authentication and authorization of Admins, they are not the same as Students or teachers etc
 */
@ObjectType()
@modelOptions({ options: { customName: 'user' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class UserSchema extends BaseUser {
	@Field()
  @prop({ unique: true, required: true, validate: [validateString, validateAscii, validateStrLength(3, 24), validateUsername] })
	public username!: string;

	@prop({ unique: true, required: true, validate: [validateString, validateEmail, validateStrLength(3, 320)] })
	public email!: string;

	@prop({ default: false })
	public verifiedEmail!: boolean;

	@prop({ default: randomKey() })
	public emailVerificationCode?: string;

	@prop({ required: true, validate: [validateString] })
	private password!: string;

	public async hashPassword(this: DocumentType<UserSchema>, password: string) {
		const salt = await genSalt();

		this.password = await hash(password, salt);
	}

	public checkPassword(password: string): Promise<boolean> {
		return compare(password, this.password);
	}

	public verifyEmail(verificationCode: string) {
		if (this.emailVerificationCode === verificationCode) {
			this.verifiedEmail = true;
			this.emailVerificationCode = undefined;
		}
		return this.verifiedEmail;
	}
}

export const UserModel = getModelForClass(UserSchema);
