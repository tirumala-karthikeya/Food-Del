import mongoose from 'mongoose';

let cached = global.__mongooseConn;
if (!cached) cached = global.__mongooseConn = { conn: null, promise: null };

export const connectDB = async () => {
    if (cached.conn) return cached.conn;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set");
    }
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(uri, { serverSelectionTimeoutMS: 8000 })
            .then((m) => {
                console.log("DB Connected");
                return m;
            })
            .catch((err) => {
                // Reset so the next request retries instead of reusing a
                // rejected promise for the life of the container.
                cached.promise = null;
                throw err;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
