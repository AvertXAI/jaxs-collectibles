//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
export enum ErrorSource {
    VALIDATION = "VALIDATION_CORTEX",
    DATABASE = "DATABASE_CORTEX",
    STORAGE = "STORAGE_CORTEX",
    AUTH = "IDENTITY_CORTEX",
    UNKNOWN = "UNKNOWN_CORTEX"
}

export class BrainError extends Error {
    constructor(
        public message: string,
        public source: ErrorSource,
        public statusCode: number = 500,
        public rawError?: any
    ) {
        super(message);
        this.name = "BrainError";
    }
}