// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin toolbar — always visible, God Mode always active in demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: components/admin-toolbar.tsx
// -----------------------------------------------------------
'use client'
import { useState, useEffect } from 'react'
import { Eye, Settings, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminToolbar() {
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const isAdminView = pathname.startsWith('/admin') || pathname.startsWith('/vault')

    // Hydration shield — prevents SSR/client mismatch on pathname-dependent UI.
    useEffect(() => { setMounted(true) }, [])
    if (!mounted) return null

    return (
        <div className="bg-[#1B263B] border-b border-white/10 px-6 py-2 flex items-center justify-between sticky top-0 z-[9999] shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                    <Crown size={14} className="text-[#D9B36C]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C]">
                        God Mode Active
                    </span>
                </div>

                <div className="flex items-center bg-black/20 rounded-full p-1 gap-1">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${!isAdminView ? 'bg-[#590202] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        <Eye size={12} /> Web View
                    </Link>
                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${isAdminView ? 'bg-[#D9B36C] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        <Settings size={12} /> Admin View
                    </Link>
                </div>
            </div>

            <span className="text-[9px] font-black uppercase tracking-widest text-[#D9B36C]/50">
                Demo Mode
            </span>
        </div>
    )
}
