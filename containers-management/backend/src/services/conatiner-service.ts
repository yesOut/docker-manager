import {IContainerService, IContainer, IContainerStats, IContainerCommand, IContainerRepository} from './interfaces';
import { DockerContainerRepository } from './docker-repository';
import { StatsCalculator } from './stats-calculator';

export class ContainerService implements IContainerService {
    constructor(
        private repository: IContainerRepository = new DockerContainerRepository(),
        private statsCalculator: typeof StatsCalculator = StatsCalculator
    ) {}

    async getContainers(): Promise<IContainer[]> {
        return this.repository.listContainers(true);
    }

    async getContainerStats(containerId: string): Promise<IContainerStats> {
        const stats = await this.repository.getStats(containerId);
        return this.statsCalculator.calculate(stats);
    }

    async getContainerLogs(containerId: string): Promise<string> {
        const logs = await this.repository.getLogs(containerId);
        return logs.toString();
    }

    async executeCommand(containerId: string, command: IContainerCommand): Promise<void> {
        const container = this.repository.getContainer(containerId);
        await command.execute(container);
    }
}