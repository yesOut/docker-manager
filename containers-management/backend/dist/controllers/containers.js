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
exports.ContainerController = void 0;
const conatiner_service_1 = require("@/services/conatiner-service");
const container_commands_1 = require("@/services/commands/container-commands");
class ContainerController {
    constructor(service = new conatiner_service_1.ContainerService()) {
        this.service = service;
    }
    getContainers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containers = yield this.service.getContainers();
                res.json(containers);
            }
            catch (error) {
                this.handleError(res, error, 'Failed to get containers');
            }
        });
    }
    getContainerStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.service.getContainerStats(req.params.id);
                res.json(stats);
            }
            catch (error) {
                this.handleError(res, error, 'Failed to get container stats');
            }
        });
    }
    getLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield this.service.getContainerLogs(req.params.id);
                res.send(this.formatLogs(logs));
            }
            catch (error) {
                this.handleError(res, error, 'Failed to get container logs');
            }
        });
    }
    startContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCommand(req, res, new container_commands_1.StartCommand());
        });
    }
    stopContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCommand(req, res, new container_commands_1.StopCommand());
        });
    }
    restartContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCommand(req, res, new container_commands_1.RestartCommand());
        });
    }
    deleteContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleCommand(req, res, new container_commands_1.DeleteCommand());
        });
    }
    handleCommand(req, res, command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.executeCommand(req.params.id, command);
                res.json({ message: `Container ${command.name}ed successfully` });
            }
            catch (error) {
                this.handleError(res, error, `Failed to ${command.name} container`);
            }
        });
    }
    formatLogs(logs) {
        return logs
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
            const timestampEnd = line.indexOf(' ') + 1;
            return `${line.slice(0, timestampEnd)} ${line.slice(timestampEnd)}`;
        })
            .join('\n');
    }
    handleError(res, error, message) {
        console.error(message, error);
        res.status(500).json({ error: message });
    }
}
exports.ContainerController = ContainerController;
