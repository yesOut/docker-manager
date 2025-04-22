"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PAGINATION_LIMIT = exports.DEFAULT_PAGINATION_LIMIT = exports.constants = void 0;
exports.constants = {
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
};
exports.DEFAULT_PAGINATION_LIMIT = exports.constants.API.PAGINATION.DEFAULT_LIMIT;
exports.MAX_PAGINATION_LIMIT = exports.constants.API.PAGINATION.MAX_LIMIT;
