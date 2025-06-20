import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

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

		res.status(200).res.json({
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
				"firstname lastName age gender about photoUrl skills"
			)
			.populate(
				"fromUserId",
				"firstname lastName age gender about photoUrl skills"
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

userRouter.get("/feed", userAuth, async (req, res, next) => {
	try {
		// TODO:
		// User should see all user cards except
		// his own card
		// his connections that has been accepted
		//  ignored connection
		// already sent connecton requests

		const loggedInUser = req.user;

		// Pagination
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		limit = limit > 50 ? 50 : limit;

		// Find all the connection requests (sent + recieved)
		const connectionRequests = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		})
			.select("fromUserId toUserId")
			.skip(skip)
			.limit(limit);

		const hideUsersFromFeed = new Set();

		connectionRequests.forEach((req) => {
			hideUsersFromFeed.add(req.fromUserId.toString());
			hideUsersFromFeed.add(req.toUserId.toString());
		});
		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUsersFromFeed) } },
				{
					_id: {
						$ne: loggedInUser._id,
					},
				},
			],
		}).select("firstname lastName age gender about photoUrl skills");

		res.json({
			data: users,
			message: "Data fetched successfully",
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
});

export { userRouter };
