import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
	try {
		const { token } = req?.cookies;

		if (!token) {
			return res.status(401).json({
				message: "Please log in",
			});
		}

		const decodedTokenValue = await jwt.verify(
			token,
			"DEVCOnnect@0454594lkjkldjk34jkj5n4j5n4jo43j990i09ipok,mljapojoiaj"
		);

		const { _id } = decodedTokenValue;

		const user = await User.findById(_id);
		if (!user) {
			throw new Error("User not found");
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(400).send("ERROR: " + error.message);
	}
};
