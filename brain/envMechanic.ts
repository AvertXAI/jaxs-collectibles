//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: brain/envMechanic.ts
//////////////////////////////////////////////////
import { BrainError, ErrorSource } from './errors';
import { logBrainFailure } from './logger';

interface EnvStatus {
    isValid: boolean;
    missingKeys: string[];
}

export const envMechanic = {
    /**
     * Scans the .env.local file for all critical system variables.
     */
    validateEnvironment(): EnvStatus {
        const requiredKeys = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ];

        // Only check service role key if running on the server
        if (typeof window === 'undefined') {
            requiredKeys.push('SUPABASE_SERVICE_ROLE_KEY');
        }

        const missingKeys = requiredKeys.filter(key => !process.env[key]);

        if (missingKeys.length > 0) {
            const error = new BrainError(
                `CRITICAL: Missing .env.local variables: ${missingKeys.join(', ')}. Check your root directory.`,
                ErrorSource.UNKNOWN,
                500
            );
            // Trigger our specialized logger
            logBrainFailure(error, true);
            return { isValid: false, missingKeys };
        }

        return { isValid: true, missingKeys: [] };
    }
};