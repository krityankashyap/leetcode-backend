import express from 'express';
import { validateRequestBody, validateRequestParams } from '../../validators';
import { createproblemSchema, findByDifficultySchema, updateproblemSchema } from '../../validators/problem.validator';
import { ProblemController } from '../../controllers/problem.controller';




const problemRouter = express.Router();

problemRouter.post('/', validateRequestBody(createproblemSchema), ProblemController.createProblem);

problemRouter.get('/:id', ProblemController.getProblemById);

problemRouter.get('/', ProblemController.getAllProblems);

problemRouter.delete('/:id', ProblemController.deleteProblem);

problemRouter.get('/difficulty/:difficulty', validateRequestParams(findByDifficultySchema), ProblemController.findByDifficulty);

problemRouter.get('/search', ProblemController.searchProblem);

problemRouter.put('/:id', validateRequestBody(updateproblemSchema), ProblemController.updateProblem);



export default problemRouter;