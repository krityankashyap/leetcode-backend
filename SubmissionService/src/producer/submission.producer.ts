import { IProblemDetails } from "../apis/problem.apis";
import logger from "../config/logger.config";
import { SubmissionLanguage } from "../models/submission.model";
import { SubmissionQueue } from "../queue/submission.queue";

export interface ISubmissionData{
  submissionId: String,
  problem: IProblemDetails,
  code: string,
  language: SubmissionLanguage

}

export async function addSubmissionJob(submissionData: ISubmissionData): Promise<string | null> {
  try {
    const job= await SubmissionQueue.add("evaluate-submission", submissionData);

    logger.info("Submission job added", job.id);

    return job.id || null;

  } catch (error) {
    logger.error("Failed to add submission job", error);
    return null;
  }
}