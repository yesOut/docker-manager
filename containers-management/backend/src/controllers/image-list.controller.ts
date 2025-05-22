import { Request, Response } from "express";
import { IImageListRepository } from "@/services/interfaces";

export interface IImageListController {
    listImages(req: Request, res: Response): Promise<void>;
}

export interface IApiResponseFormatter {
    formatSuccess<T>(data: T, count?: number): ApiResponse<T>;
    formatError(message: string, error?: string): ApiErrorResponse;
}

export interface IQueryParameterParser {
    parseListImagesQuery(req: Request): ListImagesQuery;
}

export interface ApiResponse<T> {
    success: true;
    data: T;
    count?: number;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
}

export interface ListImagesQuery {
    all: boolean;
}

export class ApiResponseFormatter implements IApiResponseFormatter {
    formatSuccess<T>(data: T, count?: number): ApiResponse<T> {
        const response: ApiResponse<T> = {
            success: true,
            data
        };

        if (count !== undefined) {
            response.count = count;
        }

        return response;
    }

    formatError(message: string, error?: string): ApiErrorResponse {
        return {
            success: false,
            message,
            error
        };
    }
}

export class QueryParameterParser implements IQueryParameterParser {
    parseListImagesQuery(req: Request): ListImagesQuery {
        return {
            all: req.query.all === 'true' || req.query.all === '1'
        };
    }
}

export class ImageListController implements IImageListController {
    constructor(
        private readonly imageListRepository: IImageListRepository,
        private readonly responseFormatter: IApiResponseFormatter,
        private readonly queryParser: IQueryParameterParser
    ) {}

    async listImages(req: Request, res: Response): Promise<void> {
        try {
            const query = this.queryParser.parseListImagesQuery(req);

            const images = await this.imageListRepository.listImages(query.all);

            const response = this.responseFormatter.formatSuccess(images, images.length);

            res.status(200).json(response);

        } catch (error) {
            console.error('Error in listImages controller:', error);

            const errorResponse = this.responseFormatter.formatError(
                'Failed to retrieve Docker images',
                error instanceof Error ? error.message : 'Unknown error'
            );

            res.status(500).json(errorResponse);
        }
    }

    public getListImages = this.listImages.bind(this);
}