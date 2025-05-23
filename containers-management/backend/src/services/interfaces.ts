import Docker from "dockerode";


export interface IContainer {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
}
export interface IImage {
    id:string;
    image: string;
    tag?: string;
}

export interface IContainerStats {
    cpu: string;
    memory: {
        percent: string;
        usage: string;
        limit: string;
    };
}

export interface ILogFormatter {
    format(logs: Buffer): string;
}

export interface IContainerRepository {
    listContainers(all?: boolean): Promise<IContainer[]>;

    getStats(containerId: string): Promise<any>;

    getLogs(containerId: string, options?: Docker.ContainerLogsOptions & {
        follow: true
    }): Promise<NodeJS.ReadableStream>;

    getContainer(containerId: string): Docker.Container;
}

export interface IContainerService {
    getContainers(): Promise<IContainer[]>;

    getContainerStats(containerId: string): Promise<IContainerStats>;

    getContainerLogs(containerId: string): Promise<string>;

    executeCommand(containerId: string, command: IContainerCommand): Promise<void>;
}

export interface IContainerCommand {
    execute(container: Docker.Container): Promise<void>;

    readonly name: string;
}

export interface IPullImageOptions {
    image: string;
    tag?: string;
    auth?: {
        username: string;
        password: string;
        serveraddress?: string;
        email?: string;
    };

}

export interface PullRequestBody {
    image: string;
    tag?: string;
    auth?: {
        username: string;
        password: string;
        serveraddress?: string;
        email?: string;
    };
}

export interface IImagePullResult {
    stream: NodeJS.ReadableStream;
}

export interface IImageRepository {
    pullImage(opts: IPullImageOptions): Promise<IImagePullResult>;
}
export interface IImageListRepository {
    listImages(all?: boolean): Promise<IImage[]>;
}
