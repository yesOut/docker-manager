import Docker from 'dockerode';
import {PullImageCommand} from './commands/images-commands'
import {IPullImageOptions} from "@/services/interfaces";

const docker = new Docker();

async function handleUserInputPull(image: string, tag?: string, auth?: IPullImageOptions['auth']) {
    const pullCommand = new PullImageCommand({image, tag, auth});

    try {
        await pullCommand.pullImage(docker);
        console.log('Image pulled successfully.');
    } catch (err) {
        console.error('Error pulling image:', err);
    }
}