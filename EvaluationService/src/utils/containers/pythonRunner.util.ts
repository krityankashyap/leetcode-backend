import { PYTHON_IMAGE } from "../constants";
import { createNewDockerContainer } from "./createContainer.util";

export async function runPythonCode(code: string){

  const runCommand= `echo '${code}' >  code.py && python3 code.py`;

    const container= await createNewDockerContainer({  // this is going to create the container
        ImageName: PYTHON_IMAGE,
        cmdExecutable: ["/bin/sh", "-c", runCommand],       // (a) "/bin/sh -> command that we r going to use shell command inside the conatiner" , (b) -c -> we r going to use command as string
        memoryLimit: 1024*1024*1024, 
    });

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
}