import mongoose from "mongoose";
// const uri =
// 	"mongodb+srv://dumboTrumbo:FUBGrGxzfdIoCcXo@cluster0.krwg1er.mongodb.net/devconnect?retryWrites=true&w=majority&appName=Cluster0";

const uri = `mongodb://localhost:27017/devconnect`;

const clientOptions = {
	serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export default async function connectDB() {
	await mongoose.connect(uri, clientOptions);
}
