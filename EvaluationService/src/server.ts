import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startWorker } from './worker/evaluation.worker';
import { pullAllImage } from './utils/containers/pullimage';
import { runCode } from './utils/containers/codeRunner.util';
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

    await runCode({
        code: pythonCode,
        language: "python",
        timeout: 3000
    });
   }

