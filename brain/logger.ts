//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: brain/logger.ts
//////////////////////////////////////////////////
import { BrainError, ErrorSource } from './errors';

export function logBrainFailure(error: unknown, isEnvError: boolean = false) {
    if (error instanceof BrainError) {
        const border = isEnvError ? '⚠️ ========================================' : '----------------------------------------';
        const titleColor = isEnvError ? '\x1b[33m' : '\x1b[31m'; // Yellow for Env, Red for Standard
        const resetColor = '\x1b[0m';

        console.error(`\n${titleColor}${border}`);
        console.error(`[${error.source}] ${isEnvError ? 'ENVIRONMENT MISMATCH' : 'SYSTEM FAILURE'}: ${error.message}`);
        console.error(`HTTP Status: ${error.statusCode}`);
        if (error.rawError) console.error("Raw Trace:", error.rawError);
        console.error(`${border}${resetColor}\n`);
    } else {
        console.error(`\n[${ErrorSource.UNKNOWN}] 🚨 UNEXPECTED FATAL CRASH:`, error);
        console.error(`----------------------------------------\n`);
    }
}