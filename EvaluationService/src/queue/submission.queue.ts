import { Queue } from "bullmq";
import { newRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";

export const SubmissionQueue= new Queue("submission", {
  connection: newRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000
    }
  }
});

SubmissionQueue.on('error', (error)=>{
  logger.error("submission queue error", error);
});

SubmissionQueue.on("waiting", (job)=>{
  logger.info("Submission is waiting", job.id);
});