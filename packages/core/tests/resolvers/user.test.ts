import { FastifyInstance } from "fastify";
import { UserModel } from "../../src/orm";
import { RegisterUser, DeleteUser, LoginUser, User, VerifyEmail } from "../api/user";
import { setupTests } from "../setupTests";

describe("Luna > Resolvers > User", () => {
	let app: FastifyInstance;
	let userToken: string;

	setupTests((generatedApp) => {
		app = generatedApp;
	});

	test("GIVEN invalid user data THEN does not create user", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: { ...RegisterUser, variables: { user: { ...RegisterUser.variables.user, email: "test" } } },
		});

		const json = req.json();

		expect(json).toMatchObject({
			errors: [
				{
					message: "Validation Error",
					extensions: {
						code: "BAD_USER_INPUT",
						validationErrors: [
							{
								property: "email",
								value: "test",
								constraints: {
									isEmail: "email must be an email",
								},
							},
						],
					},
				},
			],
			data: null,
		});
	});

	test("GIVEN no user THEN creates user", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: RegisterUser,
		});

		const json = req.json();

		expect(json).toMatchObject({
			data: {
				register: {
					token: expect.any(String),
				},
			},
		});

		userToken = json.data.register.token;
	});

	test("GIVEN user w/o email THEN reject login", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: {
				query: LoginUser.query,
				variables: {
					user: {
						...LoginUser.variables.user,
						email: "test@test.com",
					},
				},
			},
		});

		const json = req.json();

		expect(json).toMatchObject({
			errors: [
				{
					message: "Invalid credentials",
					extensions: {
						code: "FORBIDDEN",
					},
				},
			],
		});
	});

	test("GIVEN user w/o password THEN reject login", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: {
				query: LoginUser.query,
				variables: {
					user: {
						...LoginUser.variables.user,
						password: "123",
					},
				},
			},
		});

		const json = req.json();

		expect(json).toMatchObject({
			errors: [
				{
					message: "Invalid credentials",
					extensions: {
						code: "FORBIDDEN",
					},
				},
			],
		});
	});

	test("GIVEN user THEN login user", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: LoginUser,
		});

		const json = req.json();

		expect(json).toMatchObject({
			data: {
				login: {
					token: expect.any(String),
				},
			},
		});

		userToken = json.data.login.token;
	});

	test("GIVEN user THEN fetch information", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: User,
			headers: {
				authorization: `${userToken}`,
			},
		});

		const json = req.json();
		const user = RegisterUser.variables.user;

		expect(json).toMatchObject({
			data: {
				me: {
					_id: expect.any(String),
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					username: user.username,
				},
			},
		});
	});

	test("GIVEN user w/o verification code THEN don't verify email", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: {
				query: VerifyEmail.query,
				variables: {
					verificationCode: "123",
				},
			},
			headers: {
				authorization: `${userToken}`,
			},
		});

		const json = req.json();

		expect(json).toMatchObject({
			data: {
				verifyEmail: false,
			},
		});
	});

	test("GIVEN user w/ verification code THEN verify email", async () => {
		const u = await UserModel.findOne({ username: RegisterUser.variables.user.username });
		const verificationCode = u!.emailVerificationCode;
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: {
				query: VerifyEmail.query,
				variables: {
					verificationCode,
				},
			},
			headers: {
				authorization: `${userToken}`,
			},
		});

		const json = req.json();

		expect(json).toMatchObject({
			data: {
				verifyEmail: true,
			},
		});
	});

	test("GIVEN user THEN deletes user", async () => {
		const req = await app.inject({
			url: "/graphql",
			method: "POST",
			payload: DeleteUser,
			headers: {
				authorization: `${userToken}`,
			},
		});

		const json = req.json();

		expect(json).toEqual({
			data: {
				deleteAccount: true,
			},
		});
	});
});
