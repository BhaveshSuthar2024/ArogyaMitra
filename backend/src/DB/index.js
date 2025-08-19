import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    mongoose.set("strictQuery", true);        // avoid deprecation warnings
    mongoose.set("bufferCommands", false);    // prevent query buffering

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected at host: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // stop the app if DB fails
  }
};

export default ConnectDB;
