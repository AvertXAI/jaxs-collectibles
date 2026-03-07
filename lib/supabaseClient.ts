import { createBrowserClient } from '@supabase/ssr'

// The official SSR helper handles the singleton pattern automatically
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)