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
				values: ["ignored", "interested", "accepted", "rejected"],
				message: `{VALUE} is incorrect status type`,
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	// Check if the toUserId is the same as fromUser
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
		throw new Error("Cannot send connection request to yourself!");

	next();
});

const ConnectionRequest = new mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema
);

export { ConnectionRequest };
