import { IProblem, Problem } from "../models/problem.model";

export interface IProblemRepository {
  createProblem(problem: Partial<IProblem>) : Promise<IProblem>,
  getProblemById(id: string) : Promise<IProblem | null>,
  getAllProblems() : Promise<{problems: IProblem[] , total: number}>,                // returns Array of IProblem
  updateProblem(id: string , updatedata: Partial<IProblem>) : Promise<IProblem | null>,
  deleteProblem(id: string) : Promise<boolean>,
  findByDifficulty(difficulty: "easy"|"medium"|"hard") : Promise<IProblem[]>,
  searchProblem(query: any) : Promise<IProblem[]>
}

export class ProblemRepository implements IProblemRepository{

  async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
      const newProblem= new Problem(problem);
      return newProblem.save();
  }

  async getProblemById(id: string): Promise<IProblem | null> {
      return await Problem.findById(id);
  }

  async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
      const problems= await Problem.find().sort({createdAt: -1});
      const total= await Problem.countDocuments(); // count the total number of documents

      return {problems , total};
  }

  async updateProblem(id: string, updatedata: Partial<IProblem>): Promise<IProblem | null> {
      return await Problem.findByIdAndUpdate(id, updatedata, {new: true}); // this new makes the return the updated data
  }

  async deleteProblem(id: any): Promise<boolean> {
      const result= await Problem.findOneAndDelete(id);
      return result !== null
  }

  async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]> {
      return await Problem.find({difficulty}).sort({createdAt: -1});
  }

  async searchProblem(query: any): Promise<IProblem[]> {
      const regex= new RegExp(query, "1");  // to search problem either by title or description any
      return await Problem.find({$or: [{title: regex} , {description: regex}]}).sort({ createdAt: -1});
  }
}