// repositories/device/device-management.ts

import { Server as SocketIOServer } from 'socket.io';
import { IStaticDevice } from '@/services/interfaces';
import * as os from 'node:os';

export interface IDeviceStats {
    cpuUsage: number;      // percentage 0–100
    ramUsage: number;      // percentage 0–100
    batteryLevel?: number; // percentage 0–100
    storageUsage: number;  // percentage 0–100
    temperature?: number;  // celsius
    networkSpeed?: {
        download: number;    // Mbps
        upload: number;      // Mbps
    };
    uptime: number;        // seconds
    lastUpdated: Date;
}

export interface IDeviceWithStats extends IStaticDevice {
    stats: IDeviceStats;
    isOnline: boolean;
    lastSeen: Date;
}

export type DeviceEvent =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'statsUpdated'
    | 'statusChanged';

export interface IDeviceRepository {
    findById(id: string): Promise<IDeviceWithStats | null>;
    findAll(): Promise<IDeviceWithStats[]>;
    findOnlineDevices(): Promise<IDeviceWithStats[]>;
    create(device: IStaticDevice): Promise<IDeviceWithStats>;
    update(id: string, updates: Partial<IStaticDevice>): Promise<IDeviceWithStats>;
    updateStats(id: string, stats: IDeviceStats): Promise<IDeviceWithStats>;
    updateStatus(id: string, isOnline: boolean): Promise<IDeviceWithStats>;
    delete(id: string): Promise<boolean>;

    /**
     * Returns host‐machine CPU load & RAM usage.
     */
    getLocalStats(): Promise<{
        cpu: { load: number; cores: number }[];
        ram: { total: number; free: number; used: number };
    }>;
}

export class DeviceRepository implements IDeviceRepository {
    private devices = new Map<string, IDeviceWithStats>();
    private io: SocketIOServer;

    constructor(io: SocketIOServer) {
        this.io = io;
        this.initializeSocketHandlers();
        this.startStatsMonitoring();
    }

    async findById(id: string): Promise<IDeviceWithStats | null> {
        return this.devices.get(id) || null;
    }

    async findAll(): Promise<IDeviceWithStats[]> {
        return Array.from(this.devices.values());
    }

    async findOnlineDevices(): Promise<IDeviceWithStats[]> {
        return Array.from(this.devices.values()).filter(d => d.isOnline);
    }

    async create(device: IStaticDevice): Promise<IDeviceWithStats> {
        const newDev: IDeviceWithStats = {
            ...device,
            stats: this.createInitialStats(),
            isOnline: true,
            lastSeen: new Date(),
        };
        this.devices.set(device.id, newDev);
        await this.emitDeviceEvent('created', newDev);
        return newDev;
    }

    async update(id: string, updates: Partial<IStaticDevice>): Promise<IDeviceWithStats> {
        const existing = this.devices.get(id);
        if (!existing) throw new Error(`Device with id ${id} not found`);
        const updated: IDeviceWithStats = {
            ...existing,
            ...updates,
            lastSeen: new Date(),
        };
        this.devices.set(id, updated);
        await this.emitDeviceEvent('updated', updated);
        return updated;
    }

    async updateStats(id: string, stats: IDeviceStats): Promise<IDeviceWithStats> {
        const device = this.devices.get(id);
        if (!device) throw new Error(`Device with id ${id} not found`);
        const updated: IDeviceWithStats = {
            ...device,
            stats: { ...stats, lastUpdated: new Date() },
            lastSeen: new Date(),
        };
        this.devices.set(id, updated);
        await this.emitDeviceEvent('statsUpdated', updated);
        return updated;
    }

    async updateStatus(id: string, isOnline: boolean): Promise<IDeviceWithStats> {
        const device = this.devices.get(id);
        if (!device) throw new Error(`Device with id ${id} not found`);
        const updated: IDeviceWithStats = {
            ...device,
            isOnline,
            lastSeen: new Date(),
        };
        this.devices.set(id, updated);
        await this.emitDeviceEvent('statusChanged', updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const device = this.devices.get(id);
        if (!device) return false;
        this.devices.delete(id);
        await this.emitDeviceEvent('deleted', device);
        return true;
    }

    private createInitialStats(): IDeviceStats {
        return {
            cpuUsage: 0,
            ramUsage: 0,
            batteryLevel: 100,
            storageUsage: 0,
            temperature: 45,
            networkSpeed: { download: 0, upload: 0 },
            uptime: 0,
            lastUpdated: new Date(),
        };
    }

    private async emitDeviceEvent(event: DeviceEvent, device: IDeviceWithStats): Promise<void> {
        const payload = { event, device, timestamp: new Date() };
        this.io.emit(`device:${event}`, payload);
        this.io.to(`device:${device.id}`).emit('deviceUpdate', payload);
        if (event === 'statsUpdated') {
            this.io.emit('device:stats', {
                deviceId: device.id,
                stats: device.stats,
                timestamp: new Date(),
            });
        }
    }

    /**
     * Returns host-machine CPU load and RAM usage.
     */
    async getLocalStats(): Promise<{
        cpu: { load: number; cores: number }[];
        ram: { total: number; free: number; used: number };
    }> {
        const oneMinLoad = os.loadavg()[0];
        const cores = os.cpus().length;
        const cpuArr = os.cpus().map(() => ({ load: oneMinLoad / cores, cores }));

        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;

        return {
            cpu: cpuArr,
            ram: { total: totalMem, free: freeMem, used: usedMem },
        };
    }

    private initializeSocketHandlers(): void {
        this.io.on('connection', socket => {
            socket.on('joinDeviceRoom', (id: string) => socket.join(`device:${id}`));
            socket.on('leaveDeviceRoom', (id: string) => socket.leave(`device:${id}`));
            socket.on('subscribeToStats', () => socket.join('stats-monitoring'));
            socket.on('unsubscribeFromStats', () => socket.leave('stats-monitoring'));
            socket.on('reportStats', async data => {
                try { await this.updateStats(data.deviceId, data.stats); }
                catch { socket.emit('error', { message: 'Bad stats report' }); }
            });
        });
    }

    public startStatsMonitoring(): void {
        setInterval(() => {
            for (const dev of this.devices.values()) {
                if (!dev.isOnline) continue;
                const mock: IDeviceStats = {
                    cpuUsage: Math.random() * 100,
                    ramUsage: Math.random() * 100,
                    batteryLevel: dev.stats.batteryLevel !== undefined
                        ? Math.max(0, dev.stats.batteryLevel - Math.random() * 0.1)
                        : undefined,
                    storageUsage: dev.stats.storageUsage + Math.random() * 0.01,
                    temperature: 35 + Math.random() * 30,
                    networkSpeed: { download: Math.random() * 100, upload: Math.random() * 50 },
                    uptime: dev.stats.uptime + 30,
                    lastUpdated: new Date(),
                };
                this.updateStats(dev.id, mock).catch(() => {});
            }
        }, 30000);
    }
}
