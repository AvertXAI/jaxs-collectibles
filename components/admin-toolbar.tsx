'use client'
import { useState, useEffect } from 'react'
import { Layout, Eye, Settings, ShieldCheck, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminToolbar() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const pathname = usePathname()
    const router = useRouter()
    const isAdminView = pathname.startsWith('/admin') || pathname.startsWith('/vault')
    const isStudio = pathname.startsWith('/vault')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const verifyAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            // Check custom profiles table for role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'admin') {
                setIsAdmin(true)
            }
            setLoading(false)
        }
        verifyAdmin()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        // THE FIX: Use window.location instead of router.push
        // This forces a hard reload, completely destroying the Next.js ghost cache.
        window.location.href = '/'
    }

    // THE LOCK: If still checking or not an admin, render NOTHING.
    if (loading || !isAdmin) return null

    return (
        <div className="admin-toolbar-container admin-toolbar-active">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-white/20 pr-4">
                    <ShieldCheck size={14} className="text-[#D9B36C]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        Admin Session Active
                    </span>
                </div>

                <div className="flex items-center bg-white/10 rounded-full p-1 gap-1">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${!isAdminView ? 'bg-[#590202] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Eye size={12} /> Web View
                    </Link>
                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${isAdminView ? 'bg-[#D9B36C] text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                    >
                        <Settings size={12} /> Admin View
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {!isStudio && (
                    <Link href="/vault" className="text-[9px] font-black uppercase tracking-widest text-white/80 hover:text-[#D9B36C] flex items-center gap-2 transition-colors">
                        <Layout size={12} /> Open Sanity Studio
                    </Link>
                )}

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#590202] hover:text-white transition-all bg-[#590202]/10 hover:bg-[#590202] px-3 py-1 rounded-md"
                >
                    <LogOut size={12} /> Sign Out
                </button>
            </div>
        </div>
    )
}