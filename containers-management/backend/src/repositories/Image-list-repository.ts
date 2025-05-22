import Docker from "dockerode";
import { IImage, IImageListRepository } from "@/services/interfaces";

export class ImageListRepository implements IImageListRepository {
    private docker: Docker;

    constructor(docker?: Docker) {
        this.docker = docker || new Docker();
    }

    async listImages(all: boolean = false): Promise<IImage[]> {
        try {
            const dockerImages = await this.docker.listImages({ all });

            return dockerImages.map(dockerImage => this.mapDockerImageToIImage(dockerImage));
        } catch (error) {
            console.error('Error listing Docker images:', error);
            throw new Error(`Failed to list Docker images: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private mapDockerImageToIImage(dockerImage: Docker.ImageInfo): IImage {
        let image = '<none>';
        let tag = '<none>';

        if (dockerImage.RepoTags && dockerImage.RepoTags.length > 0) {
            const repoTag = dockerImage.RepoTags[0];
            const lastColonIndex = repoTag.lastIndexOf(':');

            if (lastColonIndex !== -1) {
                image = repoTag.substring(0, lastColonIndex);
                tag = repoTag.substring(lastColonIndex + 1);
            } else {
                image = repoTag;
            }
        }

        return {
            id: dockerImage.Id.replace('sha256:', '').substring(0, 12),
            image: image,
            tag: tag !== '<none>' ? tag : undefined
        };
    }
}