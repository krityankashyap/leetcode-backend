import { Isubmission, Submission, SubmissionStatus } from "../models/submission.model";

export interface ISubmissionRepository {

  create(submissionData: Partial<Isubmission>) : Promise<Isubmission>;
  findById(id: string): Promise<Isubmission | null>;
  findByProblemId(problemId: string): Promise<Isubmission[]>;
  deleteById(id: string): Promise<boolean>;
  updateStatus(id: string, status: SubmissionStatus): Promise<Isubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
  
  async create(submissionData: Partial<Isubmission>) : Promise<Isubmission>{
    const newSubmission = await Submission.create(submissionData);
    return newSubmission;
  }

  async findById(id: string): Promise<Isubmission | null> {
    const submission= await Submission.findById(id);
    return submission;
  }

  async findByProblemId(problemId: string): Promise<Isubmission[]>{
    const submission= await Submission.find({problemId});
    return submission;
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result= await Submission.findByIdAndDelete(id)
    return result != null;
  }
  
  async updateStatus(id: string, status: SubmissionStatus): Promise<Isubmission | null>{
    const submission= await Submission.findByIdAndUpdate(id, {status}, {new: true});
    return submission;
  }
  
}