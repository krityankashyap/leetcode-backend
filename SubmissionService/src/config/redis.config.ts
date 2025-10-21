import Redis from "ioredis";
import logger from "./logger.config";

const redisConfig= {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
}


export const redis= new Redis(redisConfig);

redis.on("connect", ()=>{
  logger.info("Connected to redis successfully");
});

redis.on("error", (error)=>{
  logger.error("Error while connecting to redis", error);
});

export const newRedisConnection= async () =>{
  return new Redis(redisConfig);
}
