import Docker from "dockerode";
import logger from "../../config/logger.config";

export interface CreateContainerOptions{
 ImageName: string,
 cmdExecutable: string[],
 memoryLimit: number,

}

export async function createNewDockerContainer(options: CreateContainerOptions) {
  try {
    const docker= new Docker();

    const container= await docker.createContainer({
      Image: options.ImageName,
      Cmd: options.cmdExecutable,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,  // we don't need to add pseudo terminal 
      OpenStdin: true, // this is going to keep input stream open even if the their r no interactions
      HostConfig: {  
       Memory: options.memoryLimit,  // how much memory it should need
       PidsLimit: 100,  // to limit the No. of processes
       CpuQuota: 50000,
       CpuPeriod: 100000,
       SecurityOpt: ['no-new-privileges'], // to prevent previlege escalation
       NetworkMode: 'none', // to prevent network access
      }
    });
    logger.info("Conainer has been created with id: ", container.id);

    return container;
  } catch (error) {
    logger.error("Error while creating the container: ", error);
    return null;
  }
}