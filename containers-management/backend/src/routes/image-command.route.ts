import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ImageController } from '@/controllers/image-command.controller';
import { ImageRepository } from '@/repositories/image-management/image-list-repository';
import Docker from 'dockerode';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array(),
            timestamp: new Date().toISOString()
        });
        return;
    }
    next();
};

// Factory function to create image router with dependency injection
export function createImageRouter(docker: Docker): Router {
    const router = Router();

    // Create repository and controller instances
    const imageRepository = new ImageRepository(docker);
    const imageController = new ImageController(
        imageRepository, // IImageListRepository
        imageRepository, // IImagePullRepository
        imageRepository, // IImageBuildRepository
        imageRepository, // IImageRemoveRepository
        imageRepository, // IImageInspectRepository
        imageRepository, // IImageTagRepository
        imageRepository, // IImageSearchRepository
        imageRepository, // IImageTransferRepository
        imageRepository  // IImageMaintenanceRepository
    );

    // Validation rules
    const imageIdValidation = [
        param('imageId')
            .notEmpty()
            .withMessage('Image ID is required')
            .isString()
            .withMessage('Image ID must be a string')
    ];

    const pullImageValidation = [
        body('image')
            .notEmpty()
            .withMessage('Image name is required')
            .isString()
            .withMessage('Image name must be a string'),
        body('tag')
            .optional()
            .isString()
            .withMessage('Tag must be a string'),
        body('auth')
            .optional()
            .isObject()
            .withMessage('Auth must be an object')
    ];

    const buildImageValidation = [
        body('context')
            .notEmpty()
            .withMessage('Build context is required')
            .isString()
            .withMessage('Context must be a string'),
        body('dockerfile')
            .optional()
            .isString()
            .withMessage('Dockerfile must be a string'),
        body('tag')
            .optional()
            .isString()
            .withMessage('Tag must be a string'),
        body('buildArgs')
            .optional()
            .isObject()
            .withMessage('Build args must be an object'),
        body('labels')
            .optional()
            .isObject()
            .withMessage('Labels must be an object'),
        body('target')
            .optional()
            .isString()
            .withMessage('Target must be a string'),
        body('nocache')
            .optional()
            .isBoolean()
            .withMessage('nocache must be a boolean'),
        body('pull')
            .optional()
            .isBoolean()
            .withMessage('pull must be a boolean'),
        body('rm')
            .optional()
            .isBoolean()
            .withMessage('rm must be a boolean'),
        body('forcerm')
            .optional()
            .isBoolean()
            .withMessage('forcerm must be a boolean')
    ];

    const tagImageValidation = [
        ...imageIdValidation,
        body('repo')
            .notEmpty()
            .withMessage('Repository name is required')
            .isString()
            .withMessage('Repository name must be a string'),
        body('tag')
            .optional()
            .isString()
            .withMessage('Tag must be a string')
    ];

    const searchImagesValidation = [
        query('term')
            .notEmpty()
            .withMessage('Search term is required')
            .isString()
            .withMessage('Search term must be a string'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be an integer between 1 and 100'),
        query('filters')
            .optional()
            .custom((value) => {
                if (typeof value === 'string') {
                    try {
                        JSON.parse(value);
                        return true;
                    } catch {
                        throw new Error('Filters must be valid JSON');
                    }
                }
                return true;
            })
    ];

    const exportImagesValidation = [
        body('images')
            .isArray({ min: 1 })
            .withMessage('Images must be a non-empty array')
            .custom((images) => {
                if (!images.every((img: any) => typeof img === 'string')) {
                    throw new Error('All image IDs must be strings');
                }
                return true;
            })
    ];

    const importImageValidation = [
        body('source')
            .notEmpty()
            .withMessage('Source is required'),
        body('repo')
            .optional()
            .isString()
            .withMessage('Repository must be a string'),
        body('tag')
            .optional()
            .isString()
            .withMessage('Tag must be a string')
    ];

    // Routes

    // GET /images - List all images
    router.get('/',
        query('all').optional().isBoolean().withMessage('all must be a boolean'),
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.listImages(req, res, next);
        }
    );

    // POST /images/pull - Pull an image
    router.post('/pull',
        pullImageValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.pullImage(req, res, next);
        }
    );

    // POST /images/build - Build an image
    router.post('/build',
        buildImageValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.buildImage(req, res, next);
        }
    );

    router.delete('/:imageId',
        imageIdValidation,
        body('force').optional().isBoolean().withMessage('force must be a boolean'),
        body('noprune').optional().isBoolean().withMessage('noprune must be a boolean'),
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.removeImage(req, res, next);
        }
    );

    // GET /images/:imageId/inspect - Inspect an image
    router.get('/:imageId/inspect',
        imageIdValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.inspectImage(req, res, next);
        }
    );

    // GET /images/:imageId/details - Get detailed image information
    router.get('/:imageId/details',
        imageIdValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.getImageDetails(req, res, next);
        }
    );

    // POST /images/:imageId/tag - Tag an image
    router.post('/:imageId/tag',
        tagImageValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.tagImage(req, res, next);
        }
    );

    // DELETE /images/:imageId/tag - Untag an image
    router.delete('/:imageId/tag',
        ...imageIdValidation,
        body('repo')
            .notEmpty()
            .withMessage('Repository name is required')
            .isString()
            .withMessage('Repository name must be a string'),
        body('tag')
            .optional()
            .isString()
            .withMessage('Tag must be a string'),
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.untagImage(req, res, next);
        }
    );

    // GET /images/search - Search for images
    router.get('/search',
        searchImagesValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.searchImages(req, res, next);
        }
    );

    // POST /images/export - Export images
    router.post('/export',
        exportImagesValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.exportImages(req, res, next);
        }
    );

    // POST /images/import - Import images
    router.post('/import',
        importImageValidation,
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.importImage(req, res, next);
        }
    );

    // POST /images/prune - Prune unused images
    router.post('/prune',
        body('filters')
            .optional()
            .isObject()
            .withMessage('Filters must be an object'),
        handleValidationErrors,
        async (req: Request, res: Response, next: NextFunction) => {
            await imageController.pruneImages(req, res, next);
        }
    );

    return router;
}

// Alternative factory for more granular control
export function createImageRouterWithSeparateControllers(docker: Docker): Router {
    const router = Router();

    // Create separate repository instances for each concern
    const imageRepository = new ImageRepository(docker);

    // You could create separate controllers here if needed
    // const listController = new ImageListController(imageRepository);
    // const pullController = new ImagePullController(imageRepository);
    // etc.

    // For now, we'll use the composite controller
    const imageController = new ImageController(
        imageRepository, imageRepository, imageRepository, imageRepository,
        imageRepository, imageRepository, imageRepository, imageRepository, imageRepository
    );

    return router;
}

export default createImageRouter;