"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docker = void 0;
exports.getContainerDetails = getContainerDetails;
const dockerode_1 = __importDefault(require("dockerode"));
exports.docker = new dockerode_1.default({ socketPath: '/var/run/docker.sock' });
function getContainerDetails(containerId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const container = exports.docker.getContainer(containerId);
            const info = yield container.inspect();
            let stats = null;
            if (info.State.Running) {
                try {
                    stats = yield container.stats({ stream: false });
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error(`Error getting container stats: ${error.message}`);
                    }
                    else {
                        console.error(`Error getting container stats:`);
                    }
                }
            }
            return Object.assign(Object.assign({}, info), { stats: stats ? {
                    cpu_percentage: calculateCPUPercentage(stats),
                    memory_usage: stats.memory_stats.usage || 0,
                    memory_limit: stats.memory_stats.limit || 0
                } : null, state: info.State.Running ? 'running' : 'exited' });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error getting container details: ${error.message}`);
            }
            if (error instanceof Error) {
                throw new Error(`Failed to get container details: ${error.message}`);
            }
        }
    });
}
function calculateCPUPercentage(stats) {
    try {
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuCount = stats.cpu_stats.online_cpus || 1;
        if (systemDelta > 0 && cpuDelta > 0) {
            return (cpuDelta / systemDelta) * cpuCount * 100;
        }
        return 0;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error calculating CPU percentage: ${error.message}`);
        }
        return 0;
    }
}
