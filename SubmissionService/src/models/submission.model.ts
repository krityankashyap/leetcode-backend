import  { Document, Schema, model} from "mongoose";
import { object } from "zod";

export enum SubmissionStatus {
  completed= "COMPLETED",
  pending= "PENDING"
}

export enum SubmissionLanguage {
  Cpp= "cpp",
  python= "python"
}

export interface ISubmissionDataForTestCases{
 testCaseId: string,
 status: string
}
export interface ISubmission extends Document{
  problemId: string,
  code: string,
  language: SubmissionLanguage,
  status: SubmissionStatus,
  submissionData: ISubmissionDataForTestCases
  createdAt: Date,
  updatedAt: Date,
}

const submissionSchema= new Schema<ISubmission>({
  problemId: {
    type: String,
    required: [true , "ProblemId is required"]
  },
  code: {
    type: String,
    required: [true , "Code is required"]
  },
  language: {
    type: String,
    required: [true, "language is required"],
    enum: Object.values(SubmissionLanguage)
  },
  status: {
    type: String,
    required: true,
    default: SubmissionStatus.pending,
    enum: Object.values(SubmissionLanguage),
  },
  submissionData: {
    type: object,
    required: true,
    default: {}
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (_, record)=> {
      delete (record as any). _v;
      record.id= record._id;
      delete record._id;
      return record;
    }
  }
});

export const Submission = model<ISubmission>("submissionSchema", submissionSchema)