import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient automatically acts as a Singleton.
// It will never create multiple conflicting instances.
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)