import {config} from '@/config/environment';

type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
};

const COLORS = {
    reset: '\x1b[0m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    verbose: '\x1b[35m',
    debug: '\x1b[37m'
};

export class Logger {
    private readonly context: string;
    private readonly logLevel: number;

    constructor(context: string) {
        this.context = context;
        this.logLevel = LOG_LEVELS[config.logLevel as LogLevel] ?? LOG_LEVELS.info;
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] <= this.logLevel;
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        const color = COLORS[level];
        const levelStr = level.toUpperCase().padEnd(7);

        return `${color}[${timestamp}] ${levelStr} [${this.context}] ${message}${COLORS.reset}`;
    }

    private log(level: LogLevel, message: string, ...args: unknown[]): void {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message);

        if (level === 'error' && console.error) {
            console.error(formattedMessage, ...args);
        } else if (level === 'warn' && console.warn) {
            console.warn(formattedMessage, ...args);
        } else {
            console.log(formattedMessage, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        this.log('error', message, ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.log('warn', message, ...args);
    }

    info(message: string, ...args: unknown[]): void {
        this.log('info', message, ...args);
    }

    verbose(message: string, ...args: unknown[]): void {
        this.log('verbose', message, ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        this.log('debug', message, ...args);
    }

    static create(context: string): Logger {
        return new Logger(context);
    }
}

export default Logger.create('App');