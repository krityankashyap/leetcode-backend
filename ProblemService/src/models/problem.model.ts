import mongoose from "mongoose"


export interface ITestcase {
  input: string,
  output: string
}

export interface IProblem extends Document {
  title: string,
  description: string,
  difficulty: "easy" | "medium" | "hard",
  createdAt: Date,
  updatedAt: Date,
  editorial: string,
  testcase: ITestcase[], // array of test cases becoz a problem have many test cases
}

const testSchema= new mongoose.Schema<ITestcase>({
  input: {
    type: String,
    required: [true, "input of each testcase is required"],
    trim: true,
  },

  output: {
    type: String,
    required: [true, "output is required"],
    trim: true
  }
});

const problemSchema= new mongoose.Schema<IProblem>({
  title:{
    type: String,
    required: [true, "Title is required"],
    maxLength: [100, "Title must be under 100 characters"],
    trim: true
  },

  description:{
    type: String,
    required: [true, "Description is required"],
    trim: true
  },

  difficulty: {
    type: String,
    enum: {
      values: ["easy" , "medium" , "hard"],
      message: "Difficulty level should be indicated"
    },
    default: "easy",
    required: [true, "Difficulty is required"],
  },

  editorial: {
    type: String,
    trim: true,
  },

  testcase: [testSchema]
},
{
  timestamps: true,
  toJSON:{
      transform: (_, record)=>{
          delete (record as any).__v;  // delete the __v field
          record.id= record._id;  // add the id field
          delete record._id;  // delete the _id field
          return record;
      }
    }
});

problemSchema.index({title:1}, { unique: true});
problemSchema.index({difficulty:1});

export const Problem= mongoose.model<IProblem>("Problem", problemSchema);