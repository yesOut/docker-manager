declare global {
    type Environment = import('../config/environment').Environment;
    interface EnvironmentConfig extends import('../config/environment').EnvironmentConfig {}
}

export {};