import mongoose from "mongoose";
import { serverConfig } from ".";
import logger from "./logger.config";



export const connectDB = async () => {
  try {
    const dbUrl= serverConfig.DB_URL;

    await mongoose.connect(dbUrl);
    logger.info("Connected to mongo DB");

    mongoose.connection.on("error", (error)=>{
     logger.error("error on connecting to mongo", error);
    });

    mongoose.connection.on("disconnected", ()=>{
     logger.warn("Mongo db disconnected");
    });

  
  } catch (error) {
    logger.error("Failed to connect with mongodb", error);
    process.exit(1);  // Exit with failure
  }
}