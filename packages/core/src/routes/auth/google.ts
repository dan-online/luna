import type { FastifyInstance } from "fastify";
import { AcademicModel, SchoolModel } from "../../orm";
import { GoogleOAuth } from "../../orm/providers/google";

export default async function ConnectRouter(fastify: FastifyInstance) {
	fastify.get("/auth/connect/google", async (req) => {
		const { code } = req.query as { code: string };
		const googleOAuth = new GoogleOAuth();
		const user = await googleOAuth.callbackUser(code);
		const domain = user.email.split("@")[1].toLowerCase();
		const foundSchool = await SchoolModel.findOne({
			domain,
			verifiedDomain: true,
		});

		if (!foundSchool) {
			return false; // TODO: Error and go to frontend page
		}

		const foundAcademic = await AcademicModel.findOne({ emails: user.email });

		if (!foundAcademic) {
			const academic = new AcademicModel({
				firstName: user.given_name,
				middleName: "",
				lastName: user.family_name,
				emails: [user.email],
				school: foundSchool,
			});

			await academic.save();
		}

		return true; // TODO: generate a token and provide to the frontend
	});

	fastify.get("/auth/redirect/google", async (_req, res) => {
		const googleOAuth = new GoogleOAuth();

		return res.redirect(302, googleOAuth.profileUrl);
	});
}
