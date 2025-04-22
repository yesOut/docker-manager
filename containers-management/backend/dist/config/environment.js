"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.getConfig = exports.Environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["PRODUCTION"] = "production";
    Environment["TEST"] = "test";
})(Environment || (exports.Environment = Environment = {}));
const getConfig = () => ({
    NODE_ENV: (process.env.NODE_ENV || Environment.DEVELOPMENT),
    PORT: parseInt(process.env.PORT || '4200', 10),
    JWT_SECRET: process.env.JWT_SECRET ||
        (process.env.NODE_ENV === Environment.PRODUCTION
            ? (() => { throw new Error('JWT_SECRET must be set in production'); })()
            : 'fallback_dev_secret'),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
    LOG_LEVEL: (process.env.LOG_LEVEL || 'info'),
    ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
});
exports.getConfig = getConfig;
exports.config = (0, exports.getConfig)();
