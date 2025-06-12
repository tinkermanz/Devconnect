import mongoose, { Schema } from "mongoose";
import validator from "validator";

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
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data is not valid");
				}
			},
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

export const User = mongoose.model("User", userSchema);
