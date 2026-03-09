//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import { createContext, useContext, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Define the context
const SupabaseContext = createContext<any>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    // Using useState ensures the client is created exactly ONCE per session.
    // This completely eliminates the "Multiple GoTrueClient instances" warning.
    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Correct .env.local variable!
        )
    )

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    )
}

// Custom hook for components to use
export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (context === undefined) {
        throw new Error('useSupabase must be used inside a SupabaseProvider')
    }
    return context
}