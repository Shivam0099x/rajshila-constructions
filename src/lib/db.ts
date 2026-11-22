import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "development") {
      console.warn("MONGODB_URI is not defined in environment variables. Database features will be in offline fallback mode.");
    }
    return null;
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached!.conn;
}
