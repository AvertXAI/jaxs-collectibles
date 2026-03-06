'use client'
import { Layout, Eye, Settings, ShieldCheck, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminToolbar() {
    const pathname = usePathname();
    const isAdminView = pathname.startsWith('/admin');

    return (
        <div className="w-full bg-[#1B263B] text-white px-6 py-2 flex items-center justify-between z-[110] relative">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-white/20 pr-4">
                    <ShieldCheck size={14} className="text-[#D9B36C]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Admin Session Active</span>
                </div>

                {/* VIEW SELECTOR TOGGLE */}
                <div className="flex items-center bg-white/10 rounded-full p-1 gap-1">
                    <Link
                        href="/shop"
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${!isAdminView ? 'bg-[#590202] text-white' : 'hover:bg-white/10'}`}
                    >
                        <Eye size={12} /> Web View
                    </Link>
                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${isAdminView ? 'bg-[#D9B36C] text-black' : 'hover:bg-white/10'}`}
                    >
                        <Settings size={12} /> Admin View
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/vault" className="text-[9px] font-black uppercase tracking-widest hover:text-[#D9B36C] flex items-center gap-2">
                    <Layout size={12} /> Open Sanity Studio
                </Link>
                <button className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    Sign Out
                </button>
            </div>
        </div>
    )
}