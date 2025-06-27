import mongoose from 'mongoose';

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('DB Connection Error', error);
    process.exit(1); // stop the server if DB fails
  }
};
