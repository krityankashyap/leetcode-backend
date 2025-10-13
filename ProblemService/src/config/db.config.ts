import mongoose from "mongoose";
import { serverConfig } from ".";
import logger from "./logger.config";

export const connectDB = async () => {
  
  try {
   const db_url= serverConfig.DB_URL;

   await mongoose.connect(db_url);
   logger.info("Connected to mongodb successfully");

   mongoose.connection.on("error", (error)=>{
    logger.error("connected error to mongodb", error)
   });

   mongoose.connection.on("disconnected", (disconnected)=>{
    logger.warn("MongoDB disconnected");
   });

   
  } catch (error) {
    logger.error("Failed to connect with mongodb", error);
    process.exit(1); // The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code.
  }
}