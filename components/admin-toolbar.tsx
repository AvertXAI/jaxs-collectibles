//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useState, useEffect } from 'react'
import { Eye, Settings, ShieldCheck, LogOut, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from '@/components/supabase-provider'
import { useIdentity } from '@/context/IdentityContext'

export default function AdminToolbar() {
    const { role, loading } = useIdentity()
    const [mounted, setMounted] = useState(false)
    const supabase = useSupabase()
    const pathname = usePathname()
    const isAdminView = pathname.startsWith('/admin') || pathname.startsWith('/vault')

    // THE HYDRATION SHIELD
    useEffect(() => { setMounted(true) }, [])

    // THE SINGLE, PERFECT EARLY RETURN
    // If it's not mounted, still loading, or the user isn't an admin/owner, hide it entirely.
    if (!mounted || loading || (role !== 'admin' && role !== 'owner')) {
        return null;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    return (
        <div className="bg-[#1B263B] border-b border-white/10 px-6 py-2 flex items-center justify-between sticky top-0 z-[9999] shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                    {role === 'owner' ? (
                        <>
                            <Crown size={14} className="text-[#D9B36C]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C]">
                                God Mode Active
                            </span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                Admin Session
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center bg-black/20 rounded-full p-1 gap-1">
                    <Link href="/" className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${!isAdminView ? 'bg-[#590202] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>
                        <Eye size={12} /> Web View
                    </Link>
                    <Link href="/admin/dashboard" className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${isAdminView ? 'bg-[#D9B36C] text-black shadow-lg' : 'text-white/60 hover:text-white'}`}>
                        <Settings size={12} /> Admin View
                    </Link>
                </div>
            </div>

            <button onClick={handleSignOut} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#590202] transition-all">
                <LogOut size={12} /> Terminate Session
            </button>
        </div>
    )
}