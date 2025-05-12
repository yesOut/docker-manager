import Docker from 'dockerode';
import {
    IImageRepository,
    IPullImageOptions,
    IImagePullResult
} from '@/services/interfaces';

export class DockerImageRepository implements IImageRepository {
    constructor(private readonly docker: Docker) {
    }

    public pullImage(opts: IPullImageOptions): Promise<IImagePullResult> {
        const imageRef = opts.tag ? `${opts.image}:${opts.tag}` : opts.image;

        return new Promise<IImagePullResult>((resolve, reject) => {
            this.docker.pull(
                imageRef,
                {authconfig: opts.auth},
                (err: Error | null, stream?: NodeJS.ReadableStream) => {
                    if (err) return reject(err);
                    if (!stream) {
                        return reject(
                            new Error(`Docker.pull did not return a stream for ${imageRef}`)
                        );
                    }
                    resolve({stream});
                }
            );
        });
    }
}
