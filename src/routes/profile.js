import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateProfileData } from "../utils/validation.js";

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
	try {
		const user = req.user;

		if (!user) {
			throw new Error("Invalid Credential");
		}

		res.send(user);
	} catch (error) {
		res.status(404).send("ERROR: " + error.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
	try {
		if (!validateProfileData(req)) {
			throw new Error("Invalid Edit request");
		}

		const loggedInUser = req.user;

		Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
		await loggedInUser.save();

		console.log(loggedInUser);
		res.json({
			message: `${loggedInUser} profile updated successfully`,
			data: loggedInUser,
		});
	} catch (error) {
		res.status(400).send("ERROR: " + error.message);
	}
});

// profileRouter.patch("/profile/password");

export { profileRouter };
