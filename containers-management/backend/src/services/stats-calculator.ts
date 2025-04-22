import { IContainerStats } from './interfaces';

export class StatsCalculator {
    static calculate(stats: any): IContainerStats {
        if (!stats.cpu_stats || !stats.memory_stats) {
            throw new Error('Invalid container stats format');
        }

        const cpuDelta =
            stats.cpu_stats.cpu_usage.total_usage -
            (stats.precpu_stats?.cpu_usage?.total_usage || 0);
        const systemDelta =
            stats.cpu_stats.system_cpu_usage -
            (stats.precpu_stats?.system_cpu_usage || 0);
        const cpuCores = stats.cpu_stats.cpu_usage.percpu_usage?.length || 1;

        const cpuPercent = (cpuDelta / systemDelta) * cpuCores * 100;
        const memoryPercent =
            (stats.memory_stats.usage / stats.memory_stats.limit) * 100;

        return {
            cpu: cpuPercent.toFixed(2),
            memory: {
                percent: memoryPercent.toFixed(2),
                usage: this.formatBytes(stats.memory_stats.usage),
                limit: this.formatBytes(stats.memory_stats.limit),
            },
        };
    }

    private static formatBytes(bytes: number): string {
        if (bytes === 0) return "0 MB";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}