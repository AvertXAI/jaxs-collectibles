//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: brain/auth/identityMechanic.ts
//////////////////////////////////////////////////
import { BrainError, ErrorSource } from '../errors';
const CACHE_KEY = 'vault_identity_cortex';


export const identityMechanic = {
    /**
     * Instantly reads the identity from browser memory (0ms).
     * Used to paint the UI immediately before the database responds.
     */
    getCachedIdentity() {
        if (typeof window === 'undefined') return { user: null, role: null };

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return { user: null, role: null };

            const parsed = JSON.parse(cached);
            // Optional: You can add an expiration check here if desired
            return parsed;
        } catch (error) {
            return { user: null, role: null };
        }
    },

    /**
     * Heavy lifting: Talks to Supabase, gets the real session,
     * fetches the role, and updates the browser cache.
     */
    async syncIdentity(supabaseClient: any) {
        try {
            // THE FIX: Use getSession with a failsafe to avoid NetworkError crashes
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

            if (sessionError) {
                console.warn("[IDENTITY_MECHANIC] Session expired or unreachable.");
                return this.getCachedIdentity(); // Fallback to cache if network jitters
            }

            const user = session?.user;
            if (!user) {
                this.clearIdentity();
                return { user: null, role: null };
            }

            // Fetch clearance level with a light timeout or secondary check
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const identityData = {
                user: user,
                role: profile?.role || 'user',
                last_synced: Date.now()
            };

            if (typeof window !== 'undefined') {
                localStorage.setItem(CACHE_KEY, JSON.stringify(identityData));
            }

            return identityData;
        } catch (error: any) {
            // Silently return cache rather than throwing a red error to the user
            return this.getCachedIdentity();
        }
    },

    /**
     * Wipes the memory on logout.
     */
    clearIdentity() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY);
        }
    }
};