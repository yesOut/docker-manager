// controllers/deviceController.ts

import { Request, Response } from 'express';
import { IDeviceRepository, IDeviceStats } from '@/repositories/device/device-management';
import { IDeviceFactory } from '@/services/interfaces';

export class DeviceController {
    constructor(
        private deviceRepository: IDeviceRepository,
        private deviceFactory: IDeviceFactory
    ) {}
    getLocalStats = async (_req: Request, res: Response): Promise<void> => {
        try {
            const localStats = await this.deviceRepository.getLocalStats();
            res.status(200).json({ success: true, data: localStats });
        } catch (error) {
            console.error('Failed to fetch local stats:', error);
            res.status(500).json({
                success: false,
                message: 'Could not fetch local device stats'
            });
        }
    };
}