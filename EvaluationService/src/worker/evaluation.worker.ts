import { Job, Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { newRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCases } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner.util";
import { LANG_CONFIG } from "../config/language.config";
import { updateSubmission } from "../apis/submission.api";

function matchTestCasesWithResults(testCases: TestCases[], results: EvaluationResult[]) {
  const output: Record<string, string>= {};
  if(results.length != testCases.length){
    console.log("Test cases and result mismatched");
    return;
  } 
  testCases.map((testCases, index)=> {
    let retval= "";
    if(results[index].status === "time_limit_exceeded"){
      retval= "TLE";
    } else if(results[index].status === "failed"){
      retval= "ERROR";
    } else {
      // Match the output with the testCases output
      if(results[index].output === testCases.output){
        retval= "AC";
      } else {
        retval= "WA";
      }
    }
    output[testCases._id]= retval;
  });
  return output;
}


async function setupEvaluationWorker(){
  
  const worker= new Worker(SUBMISSION_QUEUE, async (job: Job)=>{
     logger.info(`Processing the job ${job.id}`);

     const data: EvaluationJob = job.data;

     console.log("data ", data);
     
     try {
      const testCasesRunnerProblem= data.problem.testcases.map((testcase)=>{
        return runCode({
          code: data.code,
          language: data.language,
          timeout: LANG_CONFIG[data.language].timeout,
          imageName: LANG_CONFIG[data.language].imageName,
          input: data.problem.testcases[0].input
         });
      });

      const testCasesRunnerResult: EvaluationResult[] = await Promise.all(testCasesRunnerProblem);

      console.log("testCasesRunnerResults ", testCasesRunnerResult);

      const output=  matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResult);

      console.log("output: ", output);

      await updateSubmission(data.submissionId, "completed", output || {});

     } catch (error) {
      logger.error("Evaluation job failed ", job , error);
     }
     
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