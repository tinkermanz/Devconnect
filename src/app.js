import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/user.js";
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { connectionRequestRouter } from "./routes/request.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

app.get("/feed", async (req, res, next) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(404).send("Something went wrong!");
	}
});

app.get("/user", userAuth, async (req, res, next) => {
	const userEmail = req.body.emailId;

	try {
		const user = await User.find({ emailId: userEmail });

		if (!user.length) {
			res.status(404).json({
				error: "User not found!!",
			});
		} else res.send(user);
	} catch (error) {
		res.status(400).json({ error: "Something went wrong!!" });
	}
});

app.delete("/user", async (req, res, next) => {
	const userId = req.body.userId;

	try {
		await User.findByIdAndDelete(userId);
		res.send("User deleted successfully");
	} catch (error) {
		res.status(404).json({
			error: "Something went wrong",
		});
	}
});

app.patch("/user/:userId", async (req, res, next) => {
	const userId = req.params?.userId;
	const data = req?.body;

	try {
		const ALLOWED_UPDATES = [
			"photoUrl",
			"about",
			"gender",
			"age",
			"skills",
			"userId",
		];
		const isUpdateAllowed = Object.keys(data).every((k) => {
			ALLOWED_UPDATES.includes(k);
		});

		if (!isUpdateAllowed) throw new Error("Update not allowed");

		if (data?.skills.length > 10)
			throw new Error("Skills cannot be more than 10");

		await User.findByIdAndUpdate(
			{
				_id: userId,
			},
			data,
			{
				runValidators: true,
				returnDocument: "after",
			}
		);
		res.send("User updated successfully");
	} catch (error) {
		res.status(404).json({
			error: `UPDATE FAILED: ${error.message}`,
		});
	}
});

connectDB()
	.then(() => {
		console.log("Database connection established");

		app.listen(3000, () => {
			console.log("Server is listening on port 3000");
		});
	})
	.catch(() => console.log("Database cannot be connected!"));
