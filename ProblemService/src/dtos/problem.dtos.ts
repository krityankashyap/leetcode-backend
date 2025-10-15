import { ITestcase } from "../models/problem.model";

export interface createProblemDto{
  title: string,
  description: string,
  difficulty: "easy"|"medium"|"hard",
  editorial?: string,
  testcases: ITestcase[],
}

export interface updateProblemDto{
  title?: string,
  description?: string,
  difficulty?: "easy"|"medium"|"hard",
  editorial?: string,
  testcases?: ITestcase[]
}

