import { createProblemDto, updateProblemDto } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repo";
import { NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";

export interface IProblemService{
  createProblem(problem: createProblemDto): Promise<IProblem>,
  getProblemById(id: string) : Promise<IProblem | null>,
  getAllProblems(): Promise<{problems: IProblem[] , total: number}>,
  updateproblem(id: string, updatedData: updateProblemDto) : Promise<IProblem | null>,
  deleteProblem(id: string) : Promise<boolean>,
  findByDifficulty(difficulty: "easy"|"medium"|"hard") : Promise<IProblem[]>,
  searchProblem(query: any) : Promise<IProblem[]>
}

export class ProblemService implements IProblemService{

  private problemRepository : IProblemRepository;

  constructor(problemRepository: IProblemRepository){  // constructor based dependency injection 
    this.problemRepository= problemRepository
  }

  async createProblem(problem: createProblemDto): Promise<IProblem> {
    
    const sanitizePayload= {
      ...problem,
      description: await sanitizeMarkdown(problem.description),
      editorial: problem.editorial && await sanitizeMarkdown(problem.editorial)
    }
      return await this.problemRepository.createProblem(sanitizePayload);
  }

  async getProblemById(id: string): Promise<IProblem | null> {
      const problem= await this.problemRepository.getProblemById(id);

      if(!problem){
        throw new NotFoundError("Problem not found")
      }
      return problem
  }

  async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
      return await this.problemRepository.getAllProblems();
  }

  async updateproblem(id: string, updatedData: updateProblemDto): Promise<IProblem | null> {
      const problem= await this.problemRepository.getProblemById(id);

      if(!problem){
        throw new NotFoundError("Problem not found");
      }
     const santizedPayload: Partial<IProblem> = {
      ...updatedData
     }
     if(updatedData.description){
      santizedPayload.description= await sanitizeMarkdown(updatedData.description);
     }
     if(updatedData.editorial){
      santizedPayload.editorial= await sanitizeMarkdown(updatedData.editorial);
     }

      return await this.problemRepository.updateProblem(id, santizedPayload);
  }

  async deleteProblem(id: string): Promise<boolean> {
      const result= await this.deleteProblem(id);
      if(!result){
        throw new NotFoundError("Problem not found");
      }
      return result;
  }

  async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]> {
      return await this.problemRepository.findByDifficulty(difficulty);
  }

  async searchProblem(query: any): Promise<IProblem[]> {
      return await this.problemRepository.searchProblem(query);
  }
}