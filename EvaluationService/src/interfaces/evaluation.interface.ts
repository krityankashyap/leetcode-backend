export interface TestCases {
  _id: string,
  input: string,
  output: string
}
export interface Problem {
  id: string,
  title: string,
  description: string,
  difficulty: "easy"|"medium"|"hard",
  input: string,
  output: string,
  editorial?: string,
  createdAt: string,
  updatedAt: string,
  testcases: TestCases[]
}

export interface EvaluationJob {
    submissionId: string,
    code: string,
    language: "python" | "cpp",
    problem: Problem
}

export interface EvaluationResult {
  status: "success" | "failed" | "time_limit_exceeded" | string;
  output: string | undefined;
}