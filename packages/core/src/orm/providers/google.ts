import { env } from "../../utils/dev/env";

import { OAuth2Client } from "google-auth-library";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env;

export interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
}
export interface GoogleUserPerson {
	genders: { value: string; metadata: { primary: boolean } }[];
	birthdays: {
		date: { year: number; month: number; day: number };
		metadata: { primary: boolean };
	}[];
}

export type GoogleUser = GoogleUserInfo & { gender: string; birthday?: Date };

export class GoogleOAuth extends OAuth2Client {
	public profileUrl: string;
	public constructor() {
		super(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
		this.profileUrl = this.generateAuthUrl({
			access_type: "offline",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/user.birthday.read",
				"https://www.googleapis.com/auth/user.gender.read",
			],
		});
	}

	public async callbackUser(code: string): Promise<GoogleUser> {
		const token = await this.getToken(code);

		this.setCredentials(token.tokens);

		const req = await this.request<GoogleUserInfo>({
			url: "https://www.googleapis.com/oauth2/v1/userinfo",
		});
		const userInfoReq = await this.request<GoogleUserPerson>({
			url: "https://people.googleapis.com/v1/people/me?personFields=birthdays,genders",
		});

		const doc: GoogleUser = { ...req.data, gender: "Unknown" };

		if (userInfoReq.data.birthdays) {
			const birthday = new Date();
			const foundBirthday = userInfoReq.data.birthdays.find((b) => b.metadata.primary) || userInfoReq.data.birthdays[0];

			birthday.setFullYear(foundBirthday.date.year);
			birthday.setMonth(foundBirthday.date.month - 1);
			birthday.setDate(foundBirthday.date.day);
			doc.birthday = birthday;
		}

		if (userInfoReq.data.genders) {
			const gender = userInfoReq.data.genders?.find((g) => g.metadata.primary);

			if (gender) doc.gender = gender.value;
		}

		return doc;
	}
}
