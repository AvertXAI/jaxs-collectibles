//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: context/IdentityContext.tsx
//////////////////////////////////////////////////
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabase } from '@/components/supabase-provider'
import { identityMechanic } from '@/brain/auth/identityMechanic'

interface IdentityContextType {
    user: any | null;
    role: 'user' | 'admin' | 'owner' | null;
    loading: boolean;
}

const IdentityContext = createContext<IdentityContextType>({
    user: null,
    role: null,
    loading: true,
})

export function IdentityProvider({ children }: { children: React.ReactNode }) {
    const supabase = useSupabase()
    const router = useRouter()
    const pathname = usePathname()

    // Start with neutral state to match server HTML exactly
    const [user, setUser] = useState<any | null>(null)
    const [role, setRole] = useState<'user' | 'admin' | 'owner' | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true;

        const performSync = async () => {
            const realIdentity = await identityMechanic.syncIdentity(supabase);

            if (mounted) {
                setUser(realIdentity.user);
                setRole(realIdentity.role);
                setLoading(false);

                // ==========================================
                // ⚠️ PRESENTATION MODE: LOOP DISABLED
                // ==========================================
                /* if (realIdentity.user && (!realIdentity.firstName || !realIdentity.address) && pathname !== '/onboarding') {
                    router.push('/onboarding');
                } else if (realIdentity.user && realIdentity.firstName && pathname === '/onboarding') {
                    router.push('/');
                }
                */
            }
        
        }

        // Check cache first
        const cached = identityMechanic.getCachedIdentity()
        if (cached.user && mounted) {
            setUser(cached.user)
            setRole(cached.role)
            setLoading(false)
        }

        performSync();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (event === 'SIGNED_OUT') {
                identityMechanic.clearIdentity();
                if (mounted) {
                    setUser(null);
                    setRole(null);
                    setLoading(false);
                }
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                performSync();
            }
        })

        return () => {
            mounted = false;
            subscription.unsubscribe();
        }
    }, [supabase, router, pathname])

    return (
        <IdentityContext.Provider value={{ user, role, loading }}>
            {children}
        </IdentityContext.Provider>
    )
}

export function useIdentity() {
    return useContext(IdentityContext)
}