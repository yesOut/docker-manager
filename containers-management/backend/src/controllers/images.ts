import { Request, Response, NextFunction } from 'express';
import { IImageRepository, IPullImageOptions,PullRequestBody } from '@/services/interfaces';

export class ImagesController {
    constructor(private readonly imageRepo: IImageRepository) {}

    /**
     * POST /images/pull
     * Body: { image, tag?, auth? }
     */
    public async pull(req: Request, res: Response, next: NextFunction) {
        const body = req.body as PullRequestBody;

        const opts: IPullImageOptions = {
            image: body.image,
            tag: body.tag,
            auth: body.auth,
        };

        try {
            const { stream } = await this.imageRepo.pullImage(opts);
            let log = '';
            stream.on('data', (chunk: { toString: () => string; }) => {
                log += chunk.toString();
            });

            stream.on('end', () => {
                res.status(200).json({
                    success: true,
                    logs: log.trim().split('\n'),
                });
            });

            stream.on('error', (err: any) => {
                next(err);
            });

        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message || 'Unknown error pulling image',
            });
        }
    }
}
