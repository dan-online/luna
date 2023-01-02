import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel, UserSchema } from "../../orm";
import type { Context, DocType } from "../../utils/context";
import RateLimit from "../guards/RateLimit";
import { LoginInput, RegisterInput } from "../inputs/User";
import { LoginOutput, RegisterOutput } from "../outputs/User";

@Resolver(() => UserSchema)
export class UserResolver {
	@UseMiddleware(RateLimit({ window: '10s', max: 1 }))
  @Mutation(() => RegisterOutput)
	public async register(
		@Arg('user') userInput: RegisterInput,
	): Promise<RegisterOutput> {
		const newUser = new UserModel({
			email: userInput.email,
			firstName: userInput.firstName,
			middleName: userInput.middleName,
			lastName: userInput.lastName,
			birthday: userInput.birthday,
			username: userInput.username,
		});

		await newUser.hashPassword(userInput.password);

		const user = await newUser.save();
		const token = await user.getToken();

		return {
			token,
		};
	}

	@UseMiddleware(RateLimit({ window: '2s', max: 1 }))
  @Mutation(() => LoginOutput)
	public async login(@Arg('user') userInput: LoginInput): Promise<LoginOutput> {
		const foundUser = await UserModel.findOne({ email: userInput.email });

		if (!foundUser) {
			throw new GraphQLError("Invalid credentials", {
				extensions: {
					code: "FORBIDDEN",
				},
			});
		}

		const checkLogin = await foundUser.checkPassword(userInput.password);

		if (!checkLogin) {
			throw new GraphQLError("Invalid credentials", {
				extensions: {
					code: "FORBIDDEN",
				},
			});
		}

		foundUser.lastLogin = new Date();

		await foundUser.save();

		const token = foundUser.getToken();

		return {
			token,
		};
	}

	@Authorized()
  @Query(() => UserSchema)
	public me(@Ctx() { user }: Context<DocType<UserSchema>>): UserSchema {
		return user!;
	}

	@Mutation(() => Boolean)
  @UseMiddleware(RateLimit({ window: '1s', max: 1 }))
  @Authorized()
	public async deleteAccount(
		@Ctx() { user }: Context<DocType<UserSchema>>,
	): Promise<boolean> {
		await user!.delete();
		return true;
	}

	// @Mutation(() => Boolean)
	// @UseMiddleware(RateLimit({ window: '1s', max: 1 }))
	// @Authorized()
	// public verifyEmail(@Arg('verificationCode') verificationCode: string, @Ctx() { user }: Context<DocType<UserSchema>>): Promise<boolean> {
	//   if (user!.verifiedEmail) {
	//     return true;
	//   }
	// }
}
