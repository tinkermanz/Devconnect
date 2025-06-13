import express from "express";
import { userAuth } from "../middlewares/auth.js";

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
	"/sendConnectRequest",
	userAuth,
	async (req, res, next) => {
		const user = req.user;
		console.log("Sending a connection request");

		res.send(user.firstName + "sent the connect request !");
	}
);

export { connectionRequestRouter };
