// import mongoose from "mongoose";

// const getMongoUri = () => {
//   // Support either MONGO_URI or MONGODB_URI (some env files use one or the other)
//   const raw = process.env.MONGO_URI || process.env.MONGODB_URI;
//   if (!raw) return undefined;
//   // Strip surrounding quotes if the value in .env is quoted
//   return raw.replace(/^"(.*)"$/, "$1");
// };

// const connectDB = async () => {
//   try {
//     const uri = getMongoUri();
//     if (!uri) {
//       throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
//     }
//     const conn = await mongoose.connect(uri);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     console.log("Connected DB:", mongoose.connection.name);
//   } catch (error) {
//     console.error("Database connection failed", error);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const getMongoUri = () => {
  // Support either MONGO_URI or MONGODB_URI (some env files use one or the other)
  const raw = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!raw) return undefined;
  // Strip surrounding quotes if the value in .env is quoted
  return raw.replace(/^"(.*)"$/, "$1");
};

const connectDB = async () => {
  try {
    const uri = getMongoUri();
    if (!uri) {
      throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
