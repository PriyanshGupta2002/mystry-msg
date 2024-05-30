import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const connectToDb = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Db already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "mystryDb",
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Db connection failed", error);
    process.exit();
  }
};
