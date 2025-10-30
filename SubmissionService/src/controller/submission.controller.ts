import { Request, Response } from "express";
import { SubmissionRepository } from "../repository/submission.repository";
import { SubmissionService } from "../service/submission.service";
import logger from "../config/logger.config";

const submissionRepository= new SubmissionRepository();
const submissionService= new SubmissionService(submissionRepository);

export const SubmissionController= {

  async createSubmission(req: Request, res: Response): Promise<void> {
    const submission= await submissionService.createSubmission(req.body);
     
    res.status(201).json({
      message: "Submission is done",
      data: submission,
      success: true
    });
  },

  async getSubmissionById(req: Request, res: Response): Promise<void> {
    const { id}= req.params;
    logger.info("fetching submission by id", {Submissionid: id});

    const submission= await submissionService.getSubmissionById(id);

    res.status(201).json({
      message: "Submission is done",
      data: submission,
      success: true
    });
  },
  async getProblemById(req: Request, res: Response): Promise<void> {
    const { id}= req.params;
    logger.info("Fetching problem submission by id", { ProblemId: id});

    const submission= await submissionService.getSubmissionByProblemId(id);
    res.status(201).json({
      message: "Submission is done",
      data: submission,
      success: true
    });
  },

  async deleteProblemById(req: Request, res: Response): Promise<void> {
    const { id}= req.params;
    logger.info("Deleting Submission", { submissionId: id});

    await submissionService.deleteSubmissionById(id);
    res.status(201).json({
      message: "Deletion is done",
      success: true
    });
  },

  async updateSubmission(req: Request, res: Response): Promise<void> {
    const { id}= req.params;
    const { status,  submissionData }= req.body;

    logger.info("Updating submission status", { 
      submissionId: id, 
      status,
      submissionData
      
  });

  const submission= await submissionService.updateSubmissionStatus(id, status, submissionData);

  logger.info("Submission status updated successfully", { 
    submissionId: id, 
    status 
  }  );

  res.status(200).json({
    success: true,
    message: "Submission status updated successfully",
    data: submission
  });
  },
}