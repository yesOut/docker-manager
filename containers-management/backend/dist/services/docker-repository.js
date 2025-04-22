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
exports.DockerContainerRepository = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
class DockerContainerRepository {
    constructor() {
        this.docker = new dockerode_1.default();
    }
    listContainers() {
        return __awaiter(this, arguments, void 0, function* (all = true) {
            const containers = yield this.docker.listContainers({ all });
            return containers.map(container => {
                var _a;
                return ({
                    id: container.Id,
                    name: ((_a = container.Names[0]) === null || _a === void 0 ? void 0 : _a.replace("/", "")) || 'unnamed',
                    image: container.Image,
                    state: container.State,
                    status: container.Status,
                });
            });
        });
    }
    getStats(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.docker.getContainer(containerId);
            return container.stats({ stream: false });
        });
    }
    getLogs(containerId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.docker.getContainer(containerId);
            return container.logs(Object.assign({ stdout: true, stderr: true, tail: 1000, timestamps: true, follow: true }, options));
        });
    }
    getContainer(containerId) {
        return this.docker.getContainer(containerId);
    }
}
exports.DockerContainerRepository = DockerContainerRepository;
