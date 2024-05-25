import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Database connection failed", e);
    process.exit(1);
  }
}

export default dbConnect;


// re_DFDvx2RQ_HRGBdLm8J6vWZFpP4YdYNQkN