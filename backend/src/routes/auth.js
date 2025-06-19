import express from "express";
import { validateSignUpData } from "../utils/validation.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
	try {
		// Validation of data
		validateSignUpData(req);
		// Encrypt the password
		const { password, firstName, lastName, emailId } = req.body;
		const passwordhash = await bcrypt.hash(password, 10);

		// Creatingt a new instance of the User model
		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordhash,
		});

		await user.save();

		res.send("User Created");
	} catch (err) {
		res.status(404).send("Error :" + err.message);
	}
});

authRouter.post("/login", async (req, res, next) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({
			emailId,
		});

		if (!user) throw new Error("Invalid credential");

		const isPasswordValid = await user.validatePassword(password);

		if (isPasswordValid) {
			// Create JWT Token
			const token = await user.getJWT();

			// Add token to cookie an send the response back to user browser
			res.cookie("token", token, {
				httpOnly: true,
				expires: new Date(Date.now() + 8 * 3600000),
			});

			res.status(200).json({
				data: user,
			});
		} else throw new Error("Password is not valid");
	} catch (error) {
		res.status(400).send("Error: " + error.message);
	}
});

authRouter.post("/logout", async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
	});
	res.send("User logged out successfully");
});

export { authRouter };
