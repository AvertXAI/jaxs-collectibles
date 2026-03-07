import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This ensures only ONE client is created for the entire app session
let supabaseInstance: any;

export const getSupabase = () => {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: 'jax-vault-auth-token' // Unique key to prevent conflicts
            }
        })
    }
    return supabaseInstance;
}

export const supabase = getSupabase();