"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsCalculator = void 0;
class StatsCalculator {
    static calculate(stats) {
        var _a, _b, _c, _d;
        if (!stats.cpu_stats || !stats.memory_stats) {
            throw new Error('Invalid container stats format');
        }
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage -
            (((_b = (_a = stats.precpu_stats) === null || _a === void 0 ? void 0 : _a.cpu_usage) === null || _b === void 0 ? void 0 : _b.total_usage) || 0);
        const systemDelta = stats.cpu_stats.system_cpu_usage -
            (((_c = stats.precpu_stats) === null || _c === void 0 ? void 0 : _c.system_cpu_usage) || 0);
        const cpuCores = ((_d = stats.cpu_stats.cpu_usage.percpu_usage) === null || _d === void 0 ? void 0 : _d.length) || 1;
        const cpuPercent = (cpuDelta / systemDelta) * cpuCores * 100;
        const memoryPercent = (stats.memory_stats.usage / stats.memory_stats.limit) * 100;
        return {
            cpu: cpuPercent.toFixed(2),
            memory: {
                percent: memoryPercent.toFixed(2),
                usage: this.formatBytes(stats.memory_stats.usage),
                limit: this.formatBytes(stats.memory_stats.limit),
            },
        };
    }
    static formatBytes(bytes) {
        if (bytes === 0)
            return "0 MB";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}
exports.StatsCalculator = StatsCalculator;
