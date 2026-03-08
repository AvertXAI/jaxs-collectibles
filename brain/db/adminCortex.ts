import { createClient } from '@supabase/supabase-js';
import { BrainError, ErrorSource } from '../errors';

export function getAdminCortex() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new BrainError("Missing SUPABASE_SERVICE_ROLE_KEY in environment", ErrorSource.AUTH, 500);
    }

    // Generates a specialized client that overrides security policies for administrative seeding/purging
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}