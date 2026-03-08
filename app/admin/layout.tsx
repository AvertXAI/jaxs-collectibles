//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false)
    const router = useRouter()

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

            // THE FIX: Explicitly allow 'owner' rank
            if (profile?.role === 'admin' || profile?.role === 'owner') {
                setAuthorized(true)
            } else {
                router.push('/') // Boot non-admins to home
            }
        }
        checkAccess()
    }, [router])

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#F2EFDF] flex items-center justify-center font-black animate-pulse text-[#590202]">
                VERIFYING CLEARANCE...
            </div>
        )
    }

    return <>{children}</>
}