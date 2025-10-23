import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startWorker } from './worker/evaluation.worker';
import { pullAllImage } from './utils/containers/pullimage';
import { createNewDockerContainer } from './utils/containers/createContainer.util';
import { PYTHON_IMAGE } from './utils/constants';
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);

    await startWorker();
    logger.info("Evaluation on queue has started");

    await pullAllImage();
    console.log("pulling image successfully");

    await testPythonCode();

});

   async function testPythonCode(){
    const pythonCode= `print("Hello world")`;

    // 1. take the python code and dump in a file and run the python file in the container

    const runCommand= `echo '${pythonCode}' >  code.py && python3 code.py`;

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

