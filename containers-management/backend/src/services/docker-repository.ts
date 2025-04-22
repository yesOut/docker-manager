import Docker from 'dockerode';
import { IContainer, IContainerRepository } from './interfaces';

export class DockerContainerRepository implements IContainerRepository {
    private docker = new Docker();

    async listContainers(all = true): Promise<IContainer[]> {
        const containers = await this.docker.listContainers({ all });
        return containers.map(container => ({
            id: container.Id,
            name: container.Names[0]?.replace("/", "") || 'unnamed',
            image: container.Image,
            state: container.State,
            status: container.Status,
        }));
    }

    async getStats(containerId: string): Promise<any> {
        const container = this.docker.getContainer(containerId);
        return container.stats({ stream: false });
    }

    async getLogs(containerId: string, options?: Docker.ContainerLogsOptions): Promise<NodeJS.ReadableStream> {
        const container = this.docker.getContainer(containerId);
        return container.logs({
            stdout: true,
            stderr: true,
            tail: 1000,
            timestamps: true,
            follow: true,
            ...options,
        } as Docker.ContainerLogsOptions & { follow: true });
    }


    getContainer(containerId: string): Docker.Container {
        return this.docker.getContainer(containerId);
    }
}