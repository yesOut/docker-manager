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
exports.ContainerService = void 0;
const docker_repository_1 = require("./docker-repository");
const stats_calculator_1 = require("./stats-calculator");
class ContainerService {
    constructor(repository = new docker_repository_1.DockerContainerRepository(), statsCalculator = stats_calculator_1.StatsCalculator) {
        this.repository = repository;
        this.statsCalculator = statsCalculator;
    }
    getContainers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.listContainers(true);
        });
    }
    getContainerStats(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this.repository.getStats(containerId);
            return this.statsCalculator.calculate(stats);
        });
    }
    getContainerLogs(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const logs = yield this.repository.getLogs(containerId);
            return logs.toString();
        });
    }
    executeCommand(containerId, command) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.repository.getContainer(containerId);
            yield command.execute(container);
        });
    }
}
exports.ContainerService = ContainerService;
