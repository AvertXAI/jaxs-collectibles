//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/admin/layout.tsx
//////////////////////////////////////////////////
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIdentity } from '@/context/IdentityContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // THE FIX: Instantly grab the global state
    const { user, role, loading } = useIdentity()
    const router = useRouter()

    useEffect(() => {
        // Only redirect if we have finished loading
        if (!loading) {
            if (!user) {
                router.push('/auth')
            } else if (role !== 'admin' && role !== 'owner') {
                router.push('/')
            }
        }
    }, [user, role, loading, router])

    if (loading || !user || (role !== 'admin' && role !== 'owner')) {
        return (
            <div className="min-h-screen bg-[#F2EFDF] flex items-center justify-center font-black animate-pulse text-[#590202]">
                VERIFYING CLEARANCE...
            </div>
        )
    }

    return <>{children}</>
}