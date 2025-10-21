import express from 'express';
import { SubmissionController } from '../../controller/submission.controller';
import { validateQueryParams, validateRequestBody } from '../../validators';
import { createSubmissionSchema, submissionQuerySchema, updateSubmissionStatusSchema } from '../../validators/submission.validator';

const submissionRouter = express.Router();

// POST /submissions - Create a new submission
submissionRouter.post(
  '/', 
  validateRequestBody(createSubmissionSchema), 
  SubmissionController.createSubmission
);

// GET /submissions/:id - Get submission by ID
submissionRouter.get(
  '/:id', 
  SubmissionController.getSubmissionById
);

// GET /submissions/problem/:problemId - Get all submissions for a problem
submissionRouter.get(
  '/problem/:problemId', 
  validateQueryParams(submissionQuerySchema),
  SubmissionController.getProblemById
);

// DELETE /submissions/:id - Delete a submission
submissionRouter.delete(
  '/:id', 
  SubmissionController.deleteProblemById
);

// PATCH /submissions/:id/status - Update submission status
submissionRouter.patch(
  '/:id/status', 
  validateRequestBody(updateSubmissionStatusSchema),
  SubmissionController.updateSubmission
);


export default submissionRouter;