export interface AppConstants {
    PASSWORD: {
        MIN_LENGTH: number;
        MAX_LENGTH: number;
        REQUIREMENTS: string;
    };
    AUTH: {
        TOKEN_EXPIRATION: string;
        REFRESH_TOKEN_EXPIRATION: string;
    };
    API: {
        PAGINATION: {
            DEFAULT_LIMIT: number;
            MAX_LIMIT: number;
        };
    };
}

export const constants: AppConstants = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 64,
        REQUIREMENTS: 'Must contain at least one letter, one number, and one special character',
    },
    AUTH: {
        TOKEN_EXPIRATION: '1h',
        REFRESH_TOKEN_EXPIRATION: '7d',
    },
    API: {
        PAGINATION: {
            DEFAULT_LIMIT: 10,
            MAX_LIMIT: 100,
        },
    },
} as const;

export const DEFAULT_PAGINATION_LIMIT = constants.API.PAGINATION.DEFAULT_LIMIT;
export const MAX_PAGINATION_LIMIT = constants.API.PAGINATION.MAX_LIMIT;