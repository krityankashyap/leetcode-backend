import { z } from "zod"

export const createproblemSchema= z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  editorial: z.string().optional(),
  testcases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
  }))

});

export const updateproblemSchema= z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  editorial: z.string().optional(),
  testcases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
  })).optional(),
});

export const findByDifficultySchema= z.object({
  difficulty: z.enum(["easy", "medium", "hard"])
})

export const searchProblemSchema= z.object({
  query: z.string().min(1)
})


export type createProblemDto= z.infer<typeof createproblemSchema>
export type updateProblemDto= z.infer<typeof updateproblemSchema>