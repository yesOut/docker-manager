import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import containerRoutes from "./routes/containers";
import userRoutes from "@/routes/user.routes";
import { config } from "@/config/environment";
import { database } from "@/config/db.config";
import {UserModel} from "@/model/user.model";

class AppConfig {
    private static readonly DEFAULT_PORT = 4200;
    private static readonly ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ];

    public static getPort(): number {
        return Number(config.port) || AppConfig.DEFAULT_PORT;
    }

    public static getCorsOptions(): cors.CorsOptions {
        return {
            origin: AppConfig.ALLOWED_ORIGINS,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        };
    }
}

class AppErrorHandler {
    public static handleError(
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        console.error(err.stack);
        res.status(500).json({ error: err.message || "Something went wrong!" });
    }
}

class Server {
    private app = express();
    private port = AppConfig.getPort();
    private db = database;

    public async initialize(): Promise<void> {
        await this.db.connect();
        this.applyMiddlewares();
        this.applyRoutes();
        this.start();
    }

    private applyMiddlewares(): void {
        this.app.use(cors(AppConfig.getCorsOptions()));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private applyRoutes(): void {
        this.app.get("/health", (req: Request, res: Response) => {
            res.json({ status: "ok" });
        });
        console.log('hello world!');
        console.log(UserModel)
        this.app.use("/", userRoutes);
        this.app.use("/containers", containerRoutes);


        this.app.use(AppErrorHandler.handleError);
    }

    private start(): void {
        this.app.listen(this.port, "0.0.0.0", () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

(async () => {
    try {
        await new Server().initialize();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
