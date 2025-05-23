import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { DeviceController } from '@/controllers/device.controller';
import { DeviceRepository } from '@/repositories/device/device-management';
import { IDeviceFactory } from '@/services/interfaces';

// Simple inline implementation of IDeviceFactory
const deviceFactory: IDeviceFactory = {
    validateDeviceData: (data: any) => {
        return typeof data.name === 'string' && typeof data.type === 'string';
    },
    createDevice: (data: any) => ({
        ...data,
        stats: data.stats || {},
        isOnline: data.isOnline || false,
        lastSeen: data.lastSeen || new Date().toISOString(),
    }),
};

/**
 * Creates and returns a router for device endpoints.
 * @param io - The Socket.IO server instance for real-time updates.
 */
export const createDeviceRoutes = (io: SocketIOServer): Router => {
    // Instantiate dependencies with Socket.IO
    const deviceRepository = new DeviceRepository(io);
    const deviceController = new DeviceController(deviceRepository, deviceFactory);

    const deviceRouter = Router();

    // GET /devices - Get all devices
    deviceRouter.get('/', deviceController.getLocalStats);

    // GET /devices/online - Get only online devices
       return deviceRouter;
};
