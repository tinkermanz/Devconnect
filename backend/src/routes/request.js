import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
	"/request/send/:status/:toUserId",
	userAuth,
	async (req, res, next) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;

			const status = req.params.status;

			const ALLOWED_STATUS = ["ignored", "interested"];

			if (!ALLOWED_STATUS.includes(status)) {
				return res.status(400).json({
					message: "Invalid status type" + status,
				});
			}

			// Check if toUserId exists on DB
			const toUser = await User.findOne({ _id: toUserId });
			if (!toUser) {
				return res.status(404).json({
					message: "User not found",
				});
			}

			// Check if there is an existing Connection Request

			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{
						fromUserId,
						toUserId,
					},
					{
						fromUserId: toUserId,
						toUserId: fromUserId,
					},
				],
			});

			if (existingConnectionRequest)
				res.status(400).send({
					message: "Connection Request Already Exists!!",
				});

			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});

			const data = await connectionRequest.save();

			res.json({
				message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
				data,
			});
		} catch (error) {
			res.status(400).send("Error: " + error.message);
		}
	}
);

connectionRequestRouter.post(
	"/request/review/:status/:requestId",
	userAuth,
	async (req, res, next) => {
		try {
			const loggedInUser = req.user;
			const { status, requestId } = req.params;

			// Validate the status
			const ALLOWED_STATUS = ["accepted", "rejected"];
			if (!ALLOWED_STATUS.includes(status)) {
				return res.status(400).json({
					message: `Status is not allowed`,
				});
			}

			const connectionRequest = await ConnectionRequest.findOne({
				_id: requestId,
				toUserId: loggedInUser._id,
				status: "interested",
			});

			if (!connectionRequest)
				return res.status(404).json({
					message: "Connection Request not found",
				});

			connectionRequest.status = status;
			const data = await connectionRequest.save();

			res.json({
				message: "Connection Request " + status,
				data,
			});

			// Some fromUser => toUserId
			// loggedInUser == toUser
			// status = intersted

			// requestId should be valid
		} catch (error) {
			res.status(400).send("ERROR: " + error.message);
		}
	}
);

export { connectionRequestRouter };
