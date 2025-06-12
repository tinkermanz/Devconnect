import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res, next) => {
	try {
		const { emailId, password } = req.body;

		const user = await User.findOne({
			emailId: emailId,
		});

		if (!user) throw new Error("Invalid credential");

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (isPasswordValid) {
			// Create JWT Token
			const token = await jwt.sign(
				{ _id: user._id },
				"DEVCOnnect@0454594lkjkldjk34jkj5n4j5n4jo43j990i09ipok,mljapojoiaj",
				{
					expiresIn: "1d",
				}
			);
			console.log(token);
			// Add token to cookie an send the response back to user browser

			res.cookie("token", token, {
				httpOnly: true,
				expires: new Date.now() + 8 * 3600000,
			});

			res.send("Login Successful");
		} else throw new Error("Password is not valid");
	} catch (error) {
		res.status(400).send("Error:" + error.message);
	}
});

app.get("/profile", async (req, res, next) => {
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

app.post("/sendConnectionRequest", async (req, res, next) => {});

connectDB()
	.then(() => {
		console.log("Database connection established");

		app.listen(3000, () => {
			console.log("Server is listening on port 3000");
		});
	})
	.catch(() => console.log("Database cannot be connected!"));
