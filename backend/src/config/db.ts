import mongoose from "mongoose";
import { config } from './env';

export const connectDB = async(): Promise<void> => {
    try{
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`MongoDB Connnected: ${conn.connection.host}`);
    } catch(error){
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
export default connectDB;