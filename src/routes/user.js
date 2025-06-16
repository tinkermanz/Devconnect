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

userRouter.get("/user/connections", userAuth, async (req, res, next) => {
	try {
		const loggedInUser = req.user;

		const connectionRequests = await ConnectionRequest.find({
			$or: [
				{
					toUserId: loggedInUser._id,
					status: "accepted",
				},
				{
					fromUserId: loggedInUser._id,
					status: "accepted",
				},
			],
		})
			.populate(
				"fromUserId",
				"firstname lastName age gender about photUrl skills"
			)
			.populate(
				"fromUserId",
				"firstname lastName age gender about photUrl skills"
			);

		const data = connectionRequests.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString())
				return row.toUserId;
			return row.toUserId;
		});

		res.json({
			data,
		});
	} catch (error) {
		res.status(400).send({
			message: error.message,
		});
	}
});

export { userRouter };
