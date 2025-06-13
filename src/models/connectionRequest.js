import mongoose, { Schema } from "mongoose";

const connectionRequestSchema = new Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		status: {
			type: String,
			enum: {
				values: ["ignore", "interested", "accepted", "rejected"],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);
const connectionRequestModel = new mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema
);

export { connectionRequestModel };
