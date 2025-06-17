import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 50,
		},
		lastName: {
			type: String,
			required: true,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid email address" + value);
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Enter a Strong password");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			enum: {
				values: ["male", "female", "other"],
				message: `{VALUE} is not valid gender type`,
			},
			/* validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data is not valid");
				}
			}, */
		},
		photoUrl: {
			type: String,
			default:
				"https://www.shutterstock.com/shutterstock/photos/1290556063/display_1500/stock-vector-vector-design-of-avatar-and-dummy-sign-collection-of-avatar-and-image-stock-vector-illustration-1290556063.jpg",
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error("Invalid URL address" + value);
				}
			},
		},
		about: {
			type: String,
			default: "This is a default about of the user!!",
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.getJWT = async function () {
	const user = this;

	const token = await jwt.sign(
		{ _id: user._id },
		"DEVCOnnect@0454594lkjkldjk34jkj5n4j5n4jo43j990i09ipok,mljapojoiaj",
		{
			expiresIn: "1d",
		}
	);
	return token;
};

userSchema.methods.validatePassword = async function (password) {
	const user = this;
	return await bcrypt.compare(password, user.password);
};

export const User = mongoose.model("User", userSchema);
