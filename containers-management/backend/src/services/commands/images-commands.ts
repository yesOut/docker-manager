import Docker from 'dockerode';
import {IContainerCommand, IPullImageOptions} from '../interfaces';

export class PullImageCommand implements IContainerCommand {
    private readonly options: IPullImageOptions;

    constructor(options: IPullImageOptions) {
        this.options = options;
    }

    get name(): string {
        return 'pull';
    }

    async execute(container: Docker.Container): Promise<void> {
        throw new Error('Pull command does not operate on existing containers.');
    }

    async pullImage(docker: Docker): Promise<void> {
        const imageRef = `${this.options.image}${this.options.tag ? `:${this.options.tag}` : ''}`;
        const authconfig = this.options.auth || undefined;

        return new Promise((resolve, reject) => {
            docker.pull(imageRef, {authconfig}, (err, stream) => {
                if (err) return reject(err);
                if (stream) {
                    docker.modem.followProgress(stream, onFinished, onProgress);
                }

                function onFinished(err: Error | null) {
                    if (err) reject(err);
                    else resolve();
                }

                function onProgress(event: any) {
                    if (event.status) {
                        console.log(`[Docker Pull] ${event.status} ${event.progress || ''}`);
                    }
                }
            });
        });
    }
}
