import  { Document, Schema, model} from "mongoose";

export enum SubmissionStatus {
  PENDING= "pending",
  COMPILING= "compiling",
  RUNNING= "running",
  ACCEPTED= "accepted",
  WRONG_ANSWER= "wrong answer",
}

export enum SubmissionLanguage {
  Cpp= "cpp",
  python= "python"
}

export interface ISubmission extends Document{
  problemId: string,
  code: string,
  language: SubmissionLanguage,
  status: SubmissionStatus,
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
    default: SubmissionStatus.PENDING,
    enum: Object.values(SubmissionLanguage),
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