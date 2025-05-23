import Docker from "dockerode";
import * as fs from "fs/promises";
import * as path from "path";
import { Readable } from "stream";
import {
    IImageDetails,
    IImageListRepository,
    IImagePullRepository,
    IImageBuildRepository,
    IImageRemoveRepository,
    IImageInspectRepository,
    IImageTagRepository,
    IImageSearchRepository,
    IImageTransferRepository,
    IImageMaintenanceRepository,
    IImageBuildOptions,
    IImageBuildResult,
    IImageRemoveOptions,
    IImageRemoveResult,
    IImageTagOptions,
    IImageInspectResult,
    IImageSearchOptions,
    IImageSearchResult,
    IImageExportOptions,
    IImageImportOptions,
    IImagePruneOptions,
    IImagePruneResult,
} from "@/services/IImage";
import {IPullImageOptions, IImagePullResult, IImage} from "@/services/interfaces";

export class ImageListRepository implements IImageListRepository {
    constructor(private docker: Docker) {}

    async listImages(all: boolean = false): Promise<IImage[]> {
        try {
            const images = await this.docker.listImages({ all });
            return images.map((image: any) => ({
                id: image.Id,
                image: image.Id, // Using Id as the image identifier to match IImage interface
                tag: image.RepoTags?.[0]?.split(':')[1] || undefined // Extract tag from first RepoTag
            }));
        } catch (error: any) {
            throw new Error(`Failed to list images: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image pull operations
export class ImagePullRepository implements IImagePullRepository {
    constructor(private docker: Docker) {}

    async pullImage(opts: IPullImageOptions): Promise<IImagePullResult> {
        try {
            // Fix: Remove reference to non-existent 'fromImage' property
            const imageName = opts.image;
            if (!imageName) {
                throw new Error('Image name is required');
            }

            // Fix: Properly cast the stream to NodeJS.ReadableStream
            const stream = await this.docker.pull(imageName, {
                tag: opts.tag,
                authconfig: opts.auth
            }) as NodeJS.ReadableStream;

            return {
                stream
            };
        } catch (error: any) {
            throw new Error(`Failed to pull image: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image build operations
export class ImageBuildRepository implements IImageBuildRepository {
    constructor(private docker: Docker) {}

    async buildImage(options: IImageBuildOptions): Promise<IImageBuildResult> {
        try {
            // Validate context path exists
            await fs.access(options.context);

            const buildOptions: any = {
                dockerfile: options.dockerfile,
                t: options.tag,
                buildargs: options.buildArgs,
                labels: options.labels,
                target: options.target,
                nocache: options.nocache,
                pull: options.pull,
                rm: options.rm !== false, // Default to true
                forcerm: options.forcerm
            };

            const stream = await this.docker.buildImage(options.context, buildOptions) as unknown as NodeJS.ReadableStream;

            return {
                stream,
                imageId: undefined // Will be populated from stream events
            };
        } catch (error: any) {
            throw new Error(`Failed to build image: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image removal operations
export class ImageRemoveRepository implements IImageRemoveRepository {
    constructor(private docker: Docker) {}

    async removeImage(imageId: string, options: IImageRemoveOptions = {}): Promise<IImageRemoveResult> {
        try {
            const image = this.docker.getImage(imageId);
            const result = await image.remove({
                force: options.force,
                noprune: options.noprune
            });

            return {
                deleted: result.filter((r: any) => r.Deleted).map((r: any) => r.Deleted),
                untagged: result.filter((r: any) => r.Untagged).map((r: any) => r.Untagged)
            };
        } catch (error: any) {
            throw new Error(`Failed to remove image: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image inspection operations
export class ImageInspectRepository implements IImageInspectRepository {
    constructor(private docker: Docker) {}

    async inspectImage(imageId: string): Promise<IImageInspectResult> {
        try {
            const image = this.docker.getImage(imageId);
            const inspection = await image.inspect();

            return {
                id: inspection.Id,
                repoTags: inspection.RepoTags || [],
                size: inspection.Size,
                created: inspection.Created,
                config: {
                    env: inspection.Config.Env || [],
                    cmd: inspection.Config.Cmd || [],
                    workingDir: inspection.Config.WorkingDir || '',
                    exposedPorts: inspection.Config.ExposedPorts || {},
                    labels: inspection.Config.Labels || {}
                },
                architecture: inspection.Architecture,
                os: inspection.Os,
                rootFS: {
                    type: inspection.RootFS.Type,
                    layers: inspection.RootFS.Layers || []
                }
            };
        } catch (error: any) {
            throw new Error(`Failed to inspect image: ${error.message}`);
        }
    }

    async getImageDetails(imageId: string): Promise<IImageDetails> {
        try {
            const inspection = await this.inspectImage(imageId);

            // Fix: Remove parentId property as it doesn't exist in IImageDetails interface
            return {
                id: inspection.id,
                image: inspection.id, // Using id as the image identifier
                tag: inspection.repoTags[0]?.split(':')[1] || undefined,
                repoTags: inspection.repoTags,
                repoDigests: [], // Would need additional call to get this
                created: new Date(inspection.created), // Convert to Date object
                size: inspection.size,
                labels: inspection.config.labels,
                architecture: inspection.architecture,
                os: inspection.os
            };
        } catch (error: any) {
            throw new Error(`Failed to get image details: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image tagging operations
export class ImageTagRepository implements IImageTagRepository {
    constructor(private docker: Docker) {}

    async tagImage(imageId: string, options: IImageTagOptions): Promise<void> {
        try {
            const image = this.docker.getImage(imageId);
            await image.tag({
                repo: options.repo,
                tag: options.tag || 'latest'
            });
        } catch (error: any) {
            throw new Error(`Failed to tag image: ${error.message}`);
        }
    }

    async untagImage(imageId: string, repo: string, tag: string = 'latest'): Promise<void> {
        try {
            const image = this.docker.getImage(`${repo}:${tag}`);
            await image.remove({ noprune: true });
        } catch (error: any) {
            throw new Error(`Failed to untag image: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image search operations
export class ImageSearchRepository implements IImageSearchRepository {
    constructor(private docker: Docker) {}

    async searchImages(options: IImageSearchOptions): Promise<IImageSearchResult[]> {
        try {
            const searchOptions: any = {
                term: options.term,
                limit: options.limit || 25
            };

            if (options.filters) {
                searchOptions.filters = JSON.stringify(options.filters);
            }

            const results = await this.docker.searchImages(searchOptions);

            return results.map((result: any) => ({
                name: result.name,
                description: result.description,
                stars: result.star_count,
                official: result.is_official,
                automated: result.is_automated
            }));
        } catch (error: any) {
            throw new Error(`Failed to search images: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image import/export operations
export class ImageTransferRepository implements IImageTransferRepository {
    constructor(private docker: Docker) {}

    async exportImages(options: IImageExportOptions): Promise<NodeJS.ReadableStream> {
        try {
            const images = options.images.map(id => this.docker.getImage(id));

            if (images.length === 1) {
                return await images[0].get();
            }

            // For multiple images, we'd need to create a tar stream
            throw new Error('Multiple image export not implemented');
        } catch (error: any) {
            throw new Error(`Failed to export images: ${error.message}`);
        }
    }

    async importImage(options: IImageImportOptions): Promise<IImagePullResult> {
        try {
            let stream: NodeJS.ReadableStream;

            if (typeof options.source === 'string') {
                const fileBuffer = await fs.readFile(options.source);
                stream = Readable.from(fileBuffer);
            } else {
                stream = options.source;
            }

            const importStream = await this.docker.loadImage(stream);

            return {
                stream: importStream
            };
        } catch (error: any) {
            throw new Error(`Failed to import image: ${error.message}`);
        }
    }
}

// Single Responsibility: Handle Docker image maintenance operations
export class ImageMaintenanceRepository implements IImageMaintenanceRepository {
    constructor(private docker: Docker) {}

    async pruneImages(options: IImagePruneOptions = {}): Promise<IImagePruneResult> {
        try {
            const pruneOptions: any = {};

            if (options.filters) {
                pruneOptions.filters = JSON.stringify(options.filters);
            }

            const result: any = await this.docker.pruneImages(pruneOptions);

            return {
                imagesDeleted: result.ImagesDeleted || [],
                spaceReclaimed: result.SpaceReclaimed || 0
            };
        } catch (error: any) {
            throw new Error(`Failed to prune images: ${error.message}`);
        }
    }
}

// Composite Repository - Aggregates all image repositories
// This follows the Facade pattern to provide a unified interface
export class ImageRepository implements
    IImageListRepository,
    IImagePullRepository,
    IImageBuildRepository,
    IImageRemoveRepository,
    IImageInspectRepository,
    IImageTagRepository,
    IImageSearchRepository,
    IImageTransferRepository,
    IImageMaintenanceRepository {

    private listRepo: ImageListRepository;
    private pullRepo: ImagePullRepository;
    private buildRepo: ImageBuildRepository;
    private removeRepo: ImageRemoveRepository;
    private inspectRepo: ImageInspectRepository;
    private tagRepo: ImageTagRepository;
    private searchRepo: ImageSearchRepository;
    private transferRepo: ImageTransferRepository;
    private maintenanceRepo: ImageMaintenanceRepository;

    constructor(docker: Docker) {
        this.listRepo = new ImageListRepository(docker);
        this.pullRepo = new ImagePullRepository(docker);
        this.buildRepo = new ImageBuildRepository(docker);
        this.removeRepo = new ImageRemoveRepository(docker);
        this.inspectRepo = new ImageInspectRepository(docker);
        this.tagRepo = new ImageTagRepository(docker);
        this.searchRepo = new ImageSearchRepository(docker);
        this.transferRepo = new ImageTransferRepository(docker);
        this.maintenanceRepo = new ImageMaintenanceRepository(docker);
    }

    // Delegate to specific repositories
    async listImages(all?: boolean): Promise<IImage[]> {
        return this.listRepo.listImages(all);
    }

    async pullImage(opts: IPullImageOptions): Promise<IImagePullResult> {
        return this.pullRepo.pullImage(opts);
    }

    async buildImage(options: IImageBuildOptions): Promise<IImageBuildResult> {
        return this.buildRepo.buildImage(options);
    }

    async removeImage(imageId: string, options?: IImageRemoveOptions): Promise<IImageRemoveResult> {
        return this.removeRepo.removeImage(imageId, options);
    }

    async inspectImage(imageId: string): Promise<IImageInspectResult> {
        return this.inspectRepo.inspectImage(imageId);
    }

    async getImageDetails(imageId: string): Promise<IImageDetails> {
        return this.inspectRepo.getImageDetails(imageId);
    }

    async tagImage(imageId: string, options: IImageTagOptions): Promise<void> {
        return this.tagRepo.tagImage(imageId, options);
    }

    async untagImage(imageId: string, repo: string, tag?: string): Promise<void> {
        return this.tagRepo.untagImage(imageId, repo, tag);
    }

    async searchImages(options: IImageSearchOptions): Promise<IImageSearchResult[]> {
        return this.searchRepo.searchImages(options);
    }

    async exportImages(options: IImageExportOptions): Promise<NodeJS.ReadableStream> {
        return this.transferRepo.exportImages(options);
    }

    async importImage(options: IImageImportOptions): Promise<IImagePullResult> {
        return this.transferRepo.importImage(options);
    }

    async pruneImages(options?: IImagePruneOptions): Promise<IImagePruneResult> {
        return this.maintenanceRepo.pruneImages(options);
    }
}