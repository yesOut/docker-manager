import { Request, Response, NextFunction } from 'express';
import {
    IImageListRepository,
    IImagePullRepository,
    IImageBuildRepository,
    IImageRemoveRepository,
    IImageInspectRepository,
    IImageTagRepository,
    IImageSearchRepository,
    IImageTransferRepository,
    IImageMaintenanceRepository
} from '@/services/IImage';
import { IPullImageOptions } from '@/services/interfaces';

// Base controller interface for common functionality
interface IBaseController {
    handleError(error: Error, res: Response): void;
}

// Abstract base controller implementing common error handling
abstract class BaseController implements IBaseController {
    handleError(error: Error, res: Response): void {
        console.error('Controller Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }

    protected sendSuccess<T>(res: Response, data: T, message?: string): void {
        res.status(200).json({
            success: true,
            data,
            message,
            timestamp: new Date().toISOString()
        });
    }

    protected sendCreated<T>(res: Response, data: T, message?: string): void {
        res.status(201).json({
            success: true,
            data,
            message,
            timestamp: new Date().toISOString()
        });
    }

    protected sendNoContent(res: Response, message?: string): void {
        res.status(204).json({
            success: true,
            message,
            timestamp: new Date().toISOString()
        });
    }
}

// Single Responsibility: Handle image listing operations
export class ImageListController extends BaseController {
    constructor(private imageListRepo: IImageListRepository) {
        super();
    }

    async listImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const all = req.query.all === 'true';
            const images = await this.imageListRepo.listImages(all);

            this.sendSuccess(res, images, `Retrieved ${images.length} images`);
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image pull operations
export class ImagePullController extends BaseController {
    constructor(private imagePullRepo: IImagePullRepository) {
        super();
    }

    async pullImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { image, tag, auth } = req.body;

            if (!image) {
                res.status(400).json({
                    success: false,
                    error: 'Image name is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const options: IPullImageOptions = {
                image,
                tag: tag || 'latest',
                auth
            };

            const result = await this.imagePullRepo.pullImage(options);

            // Set headers for streaming response
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');

            // Stream the pull progress to client
            result.stream.on('data', (chunk: Buffer) => {
                const data = chunk.toString();
                res.write(data);
            });

            result.stream.on('end', () => {
                res.end();
            });

            result.stream.on('error', (error: Error) => {
                this.handleError(error, res);
            });

        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image build operations
export class ImageBuildController extends BaseController {
    constructor(private imageBuildRepo: IImageBuildRepository) {
        super();
    }

    async buildImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                context,
                dockerfile = 'Dockerfile',
                tag,
                buildArgs,
                labels,
                target,
                nocache = false,
                pull = false,
                rm = true,
                forcerm = false
            } = req.body;

            if (!context) {
                res.status(400).json({
                    success: false,
                    error: 'Build context is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const buildOptions = {
                context,
                dockerfile,
                tag,
                buildArgs,
                labels,
                target,
                nocache,
                pull,
                rm,
                forcerm
            };

            const result = await this.imageBuildRepo.buildImage(buildOptions);

            // Set headers for streaming response
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');

            // Stream the build progress to client
            result.stream.on('data', (chunk: Buffer) => {
                const data = chunk.toString();
                res.write(data);
            });

            result.stream.on('end', () => {
                res.end();
            });

            result.stream.on('error', (error: Error) => {
                this.handleError(error, res);
            });

        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image removal operations
export class ImageRemoveController extends BaseController {
    constructor(private imageRemoveRepo: IImageRemoveRepository) {
        super();
    }

    async removeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { imageId } = req.params;
            const { force = false, noprune = false } = req.body;

            if (!imageId) {
                res.status(400).json({
                    success: false,
                    error: 'Image ID is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const options = { force, noprune };
            const result = await this.imageRemoveRepo.removeImage(imageId, options);

            this.sendSuccess(res, result, 'Image removed successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image inspection operations
export class ImageInspectController extends BaseController {
    constructor(private imageInspectRepo: IImageInspectRepository) {
        super();
    }

    async inspectImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { imageId } = req.params;

            if (!imageId) {
                res.status(400).json({
                    success: false,
                    error: 'Image ID is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const inspection = await this.imageInspectRepo.inspectImage(imageId);
            this.sendSuccess(res, inspection, 'Image inspected successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }

    async getImageDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { imageId } = req.params;

            if (!imageId) {
                res.status(400).json({
                    success: false,
                    error: 'Image ID is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const details = await this.imageInspectRepo.getImageDetails(imageId);
            this.sendSuccess(res, details, 'Image details retrieved successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image tagging operations
export class ImageTagController extends BaseController {
    constructor(private imageTagRepo: IImageTagRepository) {
        super();
    }

    async tagImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { imageId } = req.params;
            const { repo, tag = 'latest' } = req.body;

            if (!imageId || !repo) {
                res.status(400).json({
                    success: false,
                    error: 'Image ID and repository name are required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            await this.imageTagRepo.tagImage(imageId, { repo, tag });
            this.sendSuccess(res, null, 'Image tagged successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }

    async untagImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { imageId } = req.params;
            const { repo, tag = 'latest' } = req.body;

            if (!imageId || !repo) {
                res.status(400).json({
                    success: false,
                    error: 'Image ID and repository name are required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            await this.imageTagRepo.untagImage(imageId, repo, tag);
            this.sendSuccess(res, null, 'Image untagged successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image search operations
export class ImageSearchController extends BaseController {
    constructor(private imageSearchRepo: IImageSearchRepository) {
        super();
    }

    async searchImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { term, limit, filters } = req.query;

            if (!term) {
                res.status(400).json({
                    success: false,
                    error: 'Search term is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const searchOptions = {
                term: term as string,
                limit: limit ? parseInt(limit as string) : 25,
                filters: filters ? JSON.parse(filters as string) : undefined
            };

            const results = await this.imageSearchRepo.searchImages(searchOptions);
            this.sendSuccess(res, results, `Found ${results.length} images`);
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image transfer operations
export class ImageTransferController extends BaseController {
    constructor(private imageTransferRepo: IImageTransferRepository) {
        super();
    }

    async exportImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { images } = req.body;

            if (!images || !Array.isArray(images) || images.length === 0) {
                res.status(400).json({
                    success: false,
                    error: 'Images array is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const exportOptions = { images };
            const stream = await this.imageTransferRepo.exportImages(exportOptions);

            // Set headers for file download
            res.setHeader('Content-Type', 'application/x-tar');
            res.setHeader('Content-Disposition', 'attachment; filename="images.tar"');

            stream.pipe(res);

            stream.on('error', (error: Error) => {
                this.handleError(error, res);
            });

        } catch (error) {
            this.handleError(error as Error, res);
        }
    }

    async importImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { source, repo, tag } = req.body;

            if (!source) {
                res.status(400).json({
                    success: false,
                    error: 'Source is required',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const importOptions = { source, repo, tag };
            const result = await this.imageTransferRepo.importImage(importOptions);

            // Set headers for streaming response
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');

            result.stream.on('data', (chunk: Buffer) => {
                const data = chunk.toString();
                res.write(data);
            });

            result.stream.on('end', () => {
                res.end();
            });

            result.stream.on('error', (error: Error) => {
                this.handleError(error, res);
            });

        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Single Responsibility: Handle image maintenance operations
export class ImageMaintenanceController extends BaseController {
    constructor(private imageMaintenanceRepo: IImageMaintenanceRepository) {
        super();
    }

    async pruneImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { filters } = req.body;
            const pruneOptions = { filters };

            const result = await this.imageMaintenanceRepo.pruneImages(pruneOptions);
            this.sendSuccess(res, result, 'Images pruned successfully');
        } catch (error) {
            this.handleError(error as Error, res);
        }
    }
}

// Composite Controller - Aggregates all image controllers
// This follows the Facade pattern to provide a unified interface
export class ImageController extends BaseController {
    private listController: ImageListController;
    private pullController: ImagePullController;
    private buildController: ImageBuildController;
    private removeController: ImageRemoveController;
    private inspectController: ImageInspectController;
    private tagController: ImageTagController;
    private searchController: ImageSearchController;
    private transferController: ImageTransferController;
    private maintenanceController: ImageMaintenanceController;

    constructor(
        imageListRepo: IImageListRepository,
        imagePullRepo: IImagePullRepository,
        imageBuildRepo: IImageBuildRepository,
        imageRemoveRepo: IImageRemoveRepository,
        imageInspectRepo: IImageInspectRepository,
        imageTagRepo: IImageTagRepository,
        imageSearchRepo: IImageSearchRepository,
        imageTransferRepo: IImageTransferRepository,
        imageMaintenanceRepo: IImageMaintenanceRepository
    ) {
        super();
        this.listController = new ImageListController(imageListRepo);
        this.pullController = new ImagePullController(imagePullRepo);
        this.buildController = new ImageBuildController(imageBuildRepo);
        this.removeController = new ImageRemoveController(imageRemoveRepo);
        this.inspectController = new ImageInspectController(imageInspectRepo);
        this.tagController = new ImageTagController(imageTagRepo);
        this.searchController = new ImageSearchController(imageSearchRepo);
        this.transferController = new ImageTransferController(imageTransferRepo);
        this.maintenanceController = new ImageMaintenanceController(imageMaintenanceRepo);
    }

    // Delegate to specific controllers
    async listImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.listController.listImages(req, res, next);
    }

    async pullImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.pullController.pullImage(req, res, next);
    }

    async buildImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.buildController.buildImage(req, res, next);
    }

    async removeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.removeController.removeImage(req, res, next);
    }

    async inspectImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.inspectController.inspectImage(req, res, next);
    }

    async getImageDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.inspectController.getImageDetails(req, res, next);
    }

    async tagImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.tagController.tagImage(req, res, next);
    }

    async untagImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.tagController.untagImage(req, res, next);
    }

    async searchImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.searchController.searchImages(req, res, next);
    }

    async exportImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.transferController.exportImages(req, res, next);
    }

    async importImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.transferController.importImage(req, res, next);
    }

    async pruneImages(req: Request, res: Response, next: NextFunction): Promise<void> {
        return this.maintenanceController.pruneImages(req, res, next);
    }
}