//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// THE FIX: We use the hook here, NOT the provider component itself, and NOT the old client file.
import { useSupabase } from '@/components/supabase-provider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false)
    const router = useRouter()

    // THE FIX: Grab the singleton instance from the provider
    const supabase = useSupabase()

    useEffect(() => {
        async function checkAccess() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'admin' || profile?.role === 'owner') {
                setAuthorized(true)
            } else {
                router.push('/') // Boot non-admins to home
            }
        }
        checkAccess()
    }, [router, supabase]) // Added supabase to dependency array

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#F2EFDF] flex items-center justify-center font-black animate-pulse text-[#590202]">
                VERIFYING CLEARANCE...
            </div>
        )
    }

    return <>{children}</>
}