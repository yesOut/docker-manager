import {IContainerCommand} from '../interfaces';
import Docker from 'dockerode';

export class StartCommand implements IContainerCommand {
    get name() {
        return 'start';
    }

    async execute(container: Docker.Container) {
        await container.start();
    }
}

export class StopCommand implements IContainerCommand {
    get name() {
        return 'stop';
    }

    async execute(container: Docker.Container) {
        await container.stop();
    }
}

export class RestartCommand implements IContainerCommand {
    get name() {
        return 'restart';
    }

    async execute(container: Docker.Container) {
        await container.restart();
    }
}

export class DeleteCommand implements IContainerCommand {
    get name() {
        return 'delete';
    }

    async execute(container: Docker.Container) {
        await container.remove({force: true});
    }
}