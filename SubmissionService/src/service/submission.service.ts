import { getProblemById } from "../apis/problem.apis";
import logger from "../config/logger.config";
import { ISubmission, SubmissionStatus } from "../models/submission.model";
import { addSubmissionJob } from "../producer/submission.producer";
import { BadRequestError, NotFoundError} from "../utils/errors/app.error";


export interface ISubmissionService {
   createSubmission(submissionata: Partial<ISubmission>): Promise<ISubmission>;
   getSubmissionById(id: string): Promise<ISubmission | null>;
   getSubmissionByProblemId(problemId: string): Promise<ISubmission[]>;
   deleteSubmissionById(id: string): Promise<boolean>;
   updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {
  private submissionRepository: ISubmissionService;

  constructor(submissionRepository: ISubmissionService){
    this.submissionRepository= submissionRepository;        // constructor based dependency injection
  }

  async createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>{

    // step1:- check is the problem exists or not by api calling to ProblemService
    if(!submissionData.problemId){
      throw new BadRequestError("Problem id is required");
    }

    if(!submissionData.code){
      throw new BadRequestError("Problem code is required");
    }

    if(!submissionData.language){
      throw new BadRequestError("language is required");
    }

    const problem= await getProblemById(submissionData.problemId); // api call

    if(!problem){
      throw new NotFoundError("Problem not found");
    }

    // step2:- Add the submission payload to the db
     const submission= await this.submissionRepository.createSubmission(submissionData);

    // step3:- After adding on db then add redis queue
    const jobId= await addSubmissionJob({
      submissionId: submissionData.id,
      problem,
      code: submissionData.code,
      language: submissionData.language,
    });

    logger.info("Submission job is added", jobId);

    return submission;
   
  }

  async getSubmissionById(id: string): Promise<ISubmission | null>{
    const submission= await this.submissionRepository.getSubmissionById(id);
    
    if(!submission){ 
      throw new NotFoundError("Submission not found");
    }
    return submission;
  }

  async getSubmissionByProblemId(problemId: string): Promise<ISubmission[]>{
    const submission= await this.submissionRepository.getSubmissionByProblemId(problemId);
    return submission;
  }

  async deleteSubmissionById(id: string): Promise<boolean>{
    const result= await this.submissionRepository.deleteSubmissionById(id);

    if(!result){
      throw new NotFoundError("Submission not found");
    }
    return result;
  }

  async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>{
    const submission= await this.submissionRepository.updateSubmissionStatus(id, status);
    
    if(!submission){
      throw new NotFoundError("Submission isn't updated");
    }
    return submission;
  }
}