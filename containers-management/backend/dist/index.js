"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const containers_1 = __importDefault(require("./routes/containers"));
class AppConfig {
    static getPort() {
        return Number(process.env.PORT) || AppConfig.DEFAULT_PORT;
    }
    static getCorsOptions() {
        return {
            origin: AppConfig.ALLOWED_ORIGINS,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type"],
            credentials: true
        };
    }
}
AppConfig.DEFAULT_PORT = 4200;
AppConfig.ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];
class AppErrorHandler {
    static handleError(err, req, res, next) {
        console.error("Error:", err.stack);
        res.status(500).json({ error: err.message || "Something went wrong!" });
    }
}
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = AppConfig.getPort();
    }
    initialize() {
        this.applyMiddlewares();
        this.applyRoutes();
        this.start();
    }
    applyMiddlewares() {
        this.app.use((0, cors_1.default)(AppConfig.getCorsOptions()));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    applyRoutes() {
        this.app.get("/health", this.healthCheck);
        this.app.use("/containers", containers_1.default);
        this.app.use(AppErrorHandler.handleError);
    }
    healthCheck(req, res) {
        res.json({ status: "ok" });
    }
    start() {
        this.app.listen(this.port, "0.0.0.0", () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}
new Server().initialize();
