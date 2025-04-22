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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = setupSocketHandlers;
const docker_1 = require("@/services/docker");
const activeLogStreams = new Map();
function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        console.log('Client connected');
        const statsInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const containers = yield docker_1.docker.listContainers({ all: true });
                const containerDetails = yield Promise.all(containers.map((container) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const details = yield (0, docker_1.getContainerDetails)(container.Id);
                        if (!details)
                            return null;
                        return {
                            id: container.Id,
                            name: container.Names[0].replace('/', ''),
                            state: details.state,
                            stats: details.stats,
                            Created: container.Created,
                            Image: container.Image
                        };
                    }
                    catch (err) {
                        console.error(`Error getting details for container ${container.Id}:`, err);
                        return null;
                    }
                })));
            }
            catch (err) {
                console.error('Error listing containers:', err);
            }
        }), 5000);
        // Handle log streaming
        socket.on('subscribe-logs', (containerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (activeLogStreams.has(containerId)) {
                    activeLogStreams.get(containerId).destroy();
                    activeLogStreams.delete(containerId);
                }
                const container = docker_1.docker.getContainer(containerId);
                const logStream = yield container.logs({
                    follow: true,
                    stdout: true,
                    stderr: true,
                    timestamps: true,
                    tail: 100
                });
                activeLogStreams.set(containerId, logStream);
                logStream.on('data', (chunk) => {
                    socket.emit('container-logs', {
                        containerId,
                        log: chunk.toString('utf8')
                    });
                });
                logStream.on('error', (error) => {
                    console.error('Log stream error:', error);
                    socket.emit('container-logs-error', {
                        containerId,
                        error: error.message
                    });
                });
            }
            catch (error) {
                console.error('Error setting up log stream:', error);
                if (error instanceof Error) {
                    socket.emit('container-logs-error', {
                        containerId,
                        error: error.message
                    });
                }
                else {
                    socket.emit('container-logs-error', {
                        error: "problem while setting up log stream",
                    });
                }
            }
        }));
        socket.on('unsubscribe-logs', (containerId) => {
            if (activeLogStreams.has(containerId)) {
                activeLogStreams.get(containerId).destroy();
                activeLogStreams.delete(containerId);
            }
        });
        socket.on('disconnect', () => {
            clearInterval(statsInterval);
            // Clean up all active log streams for this socket
            activeLogStreams.forEach(stream => stream.destroy());
            activeLogStreams.clear();
            console.log('Client disconnected');
        });
    });
}
