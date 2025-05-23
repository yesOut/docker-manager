import Docker from "dockerode";
import {IImage, IImagePullResult, IPullImageOptions} from "@/services/interfaces";


export interface IImageDetails extends IImage {
    size: number;
    created: Date;
    repoTags: string[];
    repoDigests: string[];
    architecture: string;
    os: string;
    labels: Record<string, string>;
}

export interface IImageBuildOptions {
    dockerfile: string;
    context: string;
    tag?: string;
    buildArgs?: Record<string, string>;
    labels?: Record<string, string>;
    target?: string;
    nocache?: boolean;
    pull?: boolean;
    rm?: boolean;
    forcerm?: boolean;
}

export interface IImageBuildResult {
    stream: NodeJS.ReadableStream;
    imageId?: string;
}

export interface IImageRemoveOptions {
    force?: boolean;
    noprune?: boolean;
}

export interface IImageRemoveResult {
    deleted: string[];
    untagged: string[];
}

export interface IImageTagOptions {
    repo: string;
    tag?: string;
}

export interface IImageInspectResult {
    id: string;
    repoTags: string[];
    size: number;
    created: string;
    config: {
        env: string[];
        cmd: string[];
        workingDir: string;
        exposedPorts: Record<string, object>;
        labels: Record<string, string>;
    };
    architecture: string;
    os: string;
    rootFS: {
        type: string;
        layers: string[];
    };
}

export interface IImageSearchResult {
    name: string;
    description: string;
    stars: number;
    official: boolean;
    automated: boolean;
}

export interface IImageSearchOptions {
    term: string;
    limit?: number;
    filters?: {
        'is-automated'?: boolean;
        'is-official'?: boolean;
        stars?: number;
    };
}

export interface IImageExportOptions {
    images: string[];
    outputPath?: string;
}

export interface IImageImportOptions {
    source: string | NodeJS.ReadableStream;
    repo?: string;
    tag?: string;
    message?: string;
    changes?: string[];
}

export interface IImagePruneOptions {
    filters?: {
        dangling?: boolean;
        until?: string;
        label?: string[];
    };
}

export interface IImagePruneResult {
    imagesDeleted: Array<{
        deleted?: string;
        untagged?: string;
    }>;
    spaceReclaimed: number;
}

// ==================== REPOSITORY INTERFACES (Data Layer) ====================

// Single Responsibility: Handle basic image listing
export interface IImageListRepository {
    listImages(all?: boolean): Promise<IImage[]>;
}

// Single Responsibility: Handle image pulling operations
export interface IImagePullRepository {
    pullImage(opts: IPullImageOptions): Promise<IImagePullResult>;
}

// Single Responsibility: Handle image building operations
export interface IImageBuildRepository {
    buildImage(options: IImageBuildOptions): Promise<IImageBuildResult>;
}

// Single Responsibility: Handle image removal operations
export interface IImageRemoveRepository {
    removeImage(imageId: string, options?: IImageRemoveOptions): Promise<IImageRemoveResult>;
}

// Single Responsibility: Handle image inspection operations
export interface IImageInspectRepository {
    inspectImage(imageId: string): Promise<IImageInspectResult>;
    getImageDetails(imageId: string): Promise<IImageDetails>;
}

// Single Responsibility: Handle image tagging operations
export interface IImageTagRepository {
    tagImage(imageId: string, options: IImageTagOptions): Promise<void>;
    untagImage(imageId: string, repo: string, tag?: string): Promise<void>;
}

// Single Responsibility: Handle image search operations
export interface IImageSearchRepository {
    searchImages(options: IImageSearchOptions): Promise<IImageSearchResult[]>;
}

// Single Responsibility: Handle image import/export operations
export interface IImageTransferRepository {
    exportImages(options: IImageExportOptions): Promise<NodeJS.ReadableStream>;
    importImage(options: IImageImportOptions): Promise<IImagePullResult>;
}

// Single Responsibility: Handle image maintenance operations
export interface IImageMaintenanceRepository {
    pruneImages(options?: IImagePruneOptions): Promise<IImagePruneResult>;
}

// ==================== SERVICE INTERFACES (Business Logic Layer) ====================

// Single Responsibility: Orchestrate image listing with business logic
export interface IImageListService {
    getAllImages(): Promise<IImage[]>;
    getImagesByFilter(filter: (image: IImage) => boolean): Promise<IImage[]>;
    getImageCount(): Promise<number>;
}

// Single Responsibility: Orchestrate image pull operations with validation
export interface IImagePullService {
    pullImage(image: string, tag?: string, auth?: IPullImageOptions['auth']): Promise<IImagePullResult>;
    pullImageWithProgress(image: string, tag?: string, auth?: IPullImageOptions['auth']): Promise<NodeJS.ReadableStream>;
}

// Single Responsibility: Orchestrate image build operations with validation
export interface IImageBuildService {
    buildImage(options: IImageBuildOptions): Promise<IImageBuildResult>;
    buildImageFromDockerfile(dockerfilePath: string, contextPath: string, tag?: string): Promise<IImageBuildResult>;
}

// Single Responsibility: Orchestrate image removal with safety checks
export interface IImageRemovalService {
    removeImage(imageId: string, force?: boolean): Promise<IImageRemoveResult>;
    removeImages(imageIds: string[], force?: boolean): Promise<IImageRemoveResult[]>;
    removeUnusedImages(): Promise<IImagePruneResult>;
}

// Single Responsibility: Orchestrate image inspection and details
export interface IImageInspectionService {
    getImageDetails(imageId: string): Promise<IImageDetails>;
    getImageHistory(imageId: string): Promise<any[]>;
    validateImageExists(imageId: string): Promise<boolean>;
}

// Single Responsibility: Orchestrate image tagging operations
export interface IImageTaggingService {
    tagImage(imageId: string, repo: string, tag?: string): Promise<void>;
    retagImage(oldTag: string, newTag: string): Promise<void>;
    removeTag(imageId: string, repo: string, tag?: string): Promise<void>;
}

// Single Responsibility: Orchestrate image search operations
export interface IImageSearchService {
    searchImages(term: string, limit?: number): Promise<IImageSearchResult[]>;
    searchOfficialImages(term: string): Promise<IImageSearchResult[]>;
}

// Single Responsibility: Orchestrate image transfer operations
export interface IImageTransferService {
    exportImage(imageId: string, outputPath?: string): Promise<NodeJS.ReadableStream>;
    exportImages(imageIds: string[], outputPath?: string): Promise<NodeJS.ReadableStream>;
    importImage(source: string | NodeJS.ReadableStream, repo?: string, tag?: string): Promise<IImagePullResult>;
}

// Single Responsibility: Orchestrate image maintenance operations
export interface IImageMaintenanceService {
    cleanupUnusedImages(): Promise<IImagePruneResult>;
    cleanupDanglingImages(): Promise<IImagePruneResult>;
    getImageStorageUsage(): Promise<{ total: number; used: number; available: number }>;
}

// ==================== VALIDATOR INTERFACES ====================

// Single Responsibility: Validate image-related inputs
export interface IImageValidator {
    validateImageName(imageName: string): boolean;
    validateTag(tag: string): boolean;
    validateImageId(imageId: string): boolean;
    validateBuildContext(contextPath: string): Promise<boolean>;
}

// ==================== FORMATTER INTERFACES ====================

// Single Responsibility: Format image data for different outputs
export interface IImageFormatter {
    formatImageSize(bytes: number): string;
    formatImageAge(created: Date): string;
    formatImageList(images: IImage[]): any[];
    formatImageDetails(details: IImageDetails): any;
}

// ==================== EVENT INTERFACES ====================

export interface IImageEventHandler {
    onImagePulled(image: string, tag?: string): void;
    onImageBuilt(imageId: string, tag?: string): void;
    onImageRemoved(imageId: string): void;
    onImageTagged(imageId: string, repo: string, tag?: string): void;
}

// ==================== FACTORY INTERFACES ====================

export interface IImageServiceFactory {
    createImageListService(): IImageListService;
    createImagePullService(): IImagePullService;
    createImageBuildService(): IImageBuildService;
    createImageRemovalService(): IImageRemovalService;
}

// ==================== AGGREGATE SERVICE INTERFACE ====================
export interface IImageManagementService extends
    IImageListService,
    IImagePullService,
    IImageBuildService,
    IImageRemovalService,
    IImageInspectionService,
    IImageTaggingService,
    IImageSearchService,
    IImageTransferService,
    IImageMaintenanceService {
}