import { Request, Response } from "express";
import {  ProblemService } from "../service/problem.service";
import { ProblemRepository } from "../repositories/problem.repo";

// export interface IProblemController {
//   createProblem(req: Request, res: Response): Promise<void>,
//   getProblemById(req: Request, res: Response): Promise<void>,
//   getAllProblems(req: Request, res: Response): Promise<void>,
//   updateProblem(req: Request, res: Response): Promise<void>,
//   deleteProblem(req: Request, res: Response): Promise<void>,
//   findByDifficulty(req: Request, res: Response): Promise<void>,
//   searchProblem(req: Request, res: Response): Promise<void>
// }

const problemRepository= new ProblemRepository();
const problemService= new ProblemService(problemRepository);

export const ProblemController = {
  
  async createProblem(req: Request, res: Response): Promise<void> {
      
    const problem= await problemService.createProblem(req.body);

    res.status(201).json({
      message: "Problem created successfully (controller)",
      data: problem,
      success: true,
    });
  },

  async getAllProblems(req: Request, res: Response): Promise<void> {
      const problem= await problemService.getAllProblems();

      res.status(200).json({
        message: "Problem fetched successfully",
        data: problem,
        success: true
      });
  },

  async updateProblem(req: Request, res: Response): Promise<void> {
      const problem= await problemService.updateproblem(req.params.id, req.body);

      res.status(200).json({
        message: "Problem updated successfully",
        data: problem,
        success: true
      });
  },

  async getProblemById(req: Request, res: Response): Promise<void> {
      const problem= await problemService.getProblemById(req.params.id);

      res.status(200).json({
        message: "Problem fetched successfully with given id",
        data: problem,
        success: true
      });
  },

  async deleteProblem(req: Request, res: Response): Promise<void> {
      const problem= await problemService.deleteProblem(req.params.id);

      res.status(200).json({
        message: "Problem deleted successfully",
        data: problem,
        success: true
      });
  },

  async findByDifficulty(req: Request, res: Response): Promise<void> {
      
      const difficulty= req.params.difficulty as "easy"| "medium"| "hard";  // cast it in req.params

      const problem= await problemService.findByDifficulty(difficulty);
      
      res.status(200).json({
        message: "Problem fetched successfully with given difficulty",
        data: problem,
        success: true
      });
  },

  async searchProblem(req: Request, res: Response): Promise<void> {
      const problem= await problemService.searchProblem(req.params.query as string);

      res.status(200).json({
        message: "Problem fetched successfully with given query",
        data: problem,
        success: true
      });
  }
}