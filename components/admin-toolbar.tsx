'use client'
import { useState, useEffect } from 'react'
import { Layout, Eye, Settings, ShieldCheck, LogOut, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient' // SINGLETON CLIENT

export default function AdminToolbar() {
    const [rank, setRank] = useState<'admin' | 'owner' | null>(null)
    const [loading, setLoading] = useState(true)

    const pathname = usePathname()
    const isAdminView = pathname.startsWith('/admin') || pathname.startsWith('/vault')

    useEffect(() => {
        const verifyClearance = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setRank(null)
                setLoading(false)
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'admin' || profile?.role === 'owner') {
                setRank(profile.role)
            } else {
                setRank(null)
            }
            setLoading(false)
        }

        verifyClearance()

        // Reactive listener: If you log in/out in another tab, this updates instantly
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            verifyClearance()
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/' // Force hard reload to kill memory ghosts
    }

    if (loading || !rank) return null

    return (
        <div className="bg-[#1B263B] border-b border-white/10 px-6 py-2 flex items-center justify-between sticky top-0 z-[9999] shadow-2xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                    {rank === 'owner' ? (
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

            <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#590202] transition-all"
            >
                <LogOut size={12} /> Terminate Session
            </button>
        </div>
    )
}