import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createContainer.util";

const allowListedLanguage= ["python", "cpp"];

export interface runCodeOptions{
  code: string,
  language: "python" | "cpp" | "java",
  timeout: number,
  imageName: string
}

export async function runCode(options: runCodeOptions){
   
  const {code , language, timeout, imageName}= options;
  
  if(!allowListedLanguage.includes(language)){
    throw new InternalServerError(`Invalid language ${language}`);
  }

    const container= await createNewDockerContainer({  // this is going to create the container
        ImageName: imageName,
        cmdExecutable: commands[language](code),       // (a) "/bin/sh -> command that we r going to use shell command inside the conatiner" , (b) -c -> we r going to use command as string
        memoryLimit: 1024*1024*1024, 
    });

    const timeLimitExceededTimeout= setTimeout(()=>{
        console.log("Time limit exceede");
        container?.kill();
    }, timeout)

    console.log("Container created successfully", container?.id);

    // in order to start the container
    await container?.start();

    /* Now once the container is created we have to do two things
       1) We should be able to get the logs from the containers and parse them somehow
       2) once the task has been done then we should remove the conatiner   
    */
       
       const status= await container?.wait();  //Block until a container stops, then returns the exit code.
       console.log("container status", status);

       const logs= await container?.logs({
        stdout: true,
        stderr: true
       });
       
       console.log("container logs is:" , logs?.toString());

       await container?.remove();

       clearTimeout(timeLimitExceededTimeout);
}