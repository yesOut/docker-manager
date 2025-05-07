import { Request, Response } from 'express';
import { ContainerService } from '@/services/conatiner-service';
import { StartCommand, StopCommand, RestartCommand, DeleteCommand } from '@/services/commands/container-commands';
import {IContainerCommand, IContainerStats,} from '@/services/interfaces';

export class ContainerController {
  constructor(private service: ContainerService = new ContainerService()) {}

  async getContainers(req: Request, res: Response) {
    try {
      const containers = await this.service.getContainers();
      res.json(containers);
    } catch (error) {
      this.handleError(res, error, 'Failed to get containers');
    }
  }

  async getContainerStats(req: Request, res: Response) {
    try {
      const stats = await this.service.getContainerStats(req.params.id);
      res.json(stats);
    } catch (error) {
      this.handleError(res, error, 'Failed to get container stats');
    }
  }

  async getLogs(req: Request, res: Response) {
    try {
      const logs = await this.service.getContainerLogs(req.params.id);
      res.send(this.formatLogs(logs));
    } catch (error) {
      this.handleError(res, error, 'Failed to get container logs');
    }
  }

  async startContainer(req: Request, res: Response) {
    await this.handleCommand(req, res, new StartCommand());
  }

  async stopContainer(req: Request, res: Response) {
    await this.handleCommand(req, res, new StopCommand());
  }

  async restartContainer(req: Request, res: Response) {
    await this.handleCommand(req, res, new RestartCommand());
  }

  async deleteContainer(req: Request, res: Response) {
    await this.handleCommand(req, res, new DeleteCommand());
  }
  async pullImage(req: Request, res: Response) {
    await this.handleCommand(req, res, new RestartCommand());
  }

  private async handleCommand(req: Request, res: Response, command: IContainerCommand) {
    try {
      await this.service.executeCommand(req.params.id, command);
      res.json({ message: `Container ${command.name}ed successfully` });
    } catch (error) {
      this.handleError(res, error, `Failed to ${command.name} container`);
    }
  }

  private formatLogs(logs: string): string {
    return logs
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const timestampEnd = line.indexOf(' ') + 1;
          return `${line.slice(0, timestampEnd)} ${line.slice(timestampEnd)}`;
        })
        .join('\n');
  }

  private handleError(res: Response, error: unknown, message: string) {
    console.error(message, error);
    res.status(500).json({ error: message });
  }
}