import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// We use ONE variable to hold the ONE instance
let instance: any;

export const supabase = instance || (instance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Using 'v1' here forces a fresh start for all users automatically
        storageKey: 'jax-vault-auth-v1'
    }
}));