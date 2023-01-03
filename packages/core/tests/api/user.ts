export const RegisterUser = {
	query: `mutation Register($user: RegisterInput!) {
  register(user: $user) {
    token
  }
}`,
	variables: {
		user: {
			birthday: "2000-01-01T00:00:00.000Z",
			email: "test@dancodes.online",
			firstName: "Dan",
			password: "Testing@!123",
			username: "DanTests",
			lastName: "Codes",
			middleName: "Middle", // Mmmm Dan Middle Codes
			captcha: null,
		},
	},
};

export const LoginUser = {
	query: `mutation Login($user: LoginInput!) {
  login(user: $user) {
    token
  }
}`,
	variables: {
		user: {
			email: "test@dancodes.online",
			password: "Testing@!123",
		},
	},
};

export const DeleteUser = {
	query: `mutation Mutation {
  deleteAccount
}`,
};

export const User = {
	query: `query Me {
  me {
    _id
    firstName
    lastLogin
    lastName
    middleName
    username
  }
}`,
};

export const VerifyEmail = {
	query: `mutation VerifyEmail($verificationCode: String!) {
  verifyEmail(verificationCode: $verificationCode)
}`,
	variables: {
		verificationCode: "123456",
	},
};
