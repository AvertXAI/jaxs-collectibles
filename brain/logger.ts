import { BrainError, ErrorSource } from './errors';

export function logBrainFailure(error: unknown) {
    if (error instanceof BrainError) {
        console.error(`\n[${error.source}] 🚨 SYSTEM FAILURE: ${error.message}`);
        console.error(`HTTP Status: ${error.statusCode}`);
        if (error.rawError) console.error("Raw Trace:", error.rawError);
        console.error(`----------------------------------------\n`);
    } else {
        console.error(`\n[${ErrorSource.UNKNOWN}] 🚨 UNEXPECTED FATAL CRASH:`, error);
        console.error(`----------------------------------------\n`);
    }
}