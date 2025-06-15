import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";

const userRouter = express.Router();

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res, next) => {
	try {
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			// status: "interested",
		}).populate("fromUserId", [
			"firstName",
			"lastName",
			"photoUrl",
			"gender",
			"about",
			"skills",
			"age",
		]);

		res.json({
			message: "Data fetched Successfully",
			data: connectionRequests,
		});
	} catch (error) {
		res.status(400).send("ERROR: " + error.message);
	}
});

export { userRouter };
