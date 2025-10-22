import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { newRedisConnection } from "../config/redis.config";

async function setupEvaluationWorker(){
  
  const worker= new Worker(SUBMISSION_QUEUE, async (job)=>{
     logger.info(`Processing the job ${job.id}`);
  }, {
    connection: newRedisConnection()
  });

  worker.on("error", (error)=>{
    logger.error(`Evaluation worker error: ${error}`);
  });

  worker.on("completed", (job)=>{
    logger.info(`Evaluation job completed: ${job}`);
  });

  worker.on("failed", (job, error)=>{
    logger.info(`Evaluation job failed: ${job}`, error);
  });

};

export async function startWorker() {
  await setupEvaluationWorker();
}