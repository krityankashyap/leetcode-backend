import axios from "axios"
import { serverConfig } from "../config"
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";



export async function updateSubmission(submissionId: string, status: string, output: Record<string, string>) {
    try {
      const url= `${serverConfig.SUBMISSION_SERVICE}/submissions/${submissionId}/status`
      
      const response= await axios.patch(url, {
        status,
        submissionData: output
      });
      if(response.status!== 200){
        throw new InternalServerError("Failed to update the submission")
      } 
      console.log("Submission updated successfully", response.data);
      return;
    } catch (error) {
      logger.error("failed to get problem details", error);
      return null;
    }
}