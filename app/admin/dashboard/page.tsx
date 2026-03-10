//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/admin/dashboard/page.tsx
//////////////////////////////////////////////////
'use client'
import { Database, LayoutDashboard, Package, Users, Settings, Flame, User, AlertOctagon, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/supabase-provider'

export default function AdminDashboard() {
    const supabase = useSupabase();
    const [isOwner, setIsOwner] = useState(false);
    const [purging, setPurging] = useState(false);

    useEffect(() => {
        const verifyOwner = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role === 'owner') setIsOwner(true);
            }
        }
        if (supabase) verifyOwner();
    }, [supabase]);

    const handlePurge = async () => {
        const confirm1 = window.confirm("WARNING: You are about to initiate the Purge Protocol. This will delete ALL inventory and mock users. Proceed?");
        if (!confirm1) return;

        const confirm2 = window.confirm("FINAL WARNING: This cannot be undone. Press OK to wipe the Vault.");
        if (confirm2) {
            setPurging(true);
            try {
                const res = await fetch('/api/admin/purge', { method: 'DELETE' });
                const result = await res.json();
                if (result.success) alert("Vault successfully purged.");
                else alert(`PURGE FAILED: ${result.error}`);
            } catch (err) {
                alert("Network failure during purge attempt.");
            } finally {
                setPurging(false);
            }
        }
    }

    const sidebarLinkClass = "flex items-center gap-4 bg-white border border-[#D9B36C]/20 hover:bg-[#590202] hover:text-white text-[#1B263B] p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group shadow-sm";

    return (
        <main className="min-h-screen admin-bg p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#D9B36C]/30 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[#590202]">Vault Control Center</h1>
                    <p className="text-[#1B263B]/60 text-xs font-bold uppercase tracking-[0.3em] mt-1">Authorized Personnel Only</p>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/under-construction" className="text-[#1B263B]/40 hover:text-[#590202] transition-colors" title="System Settings">
                        <Settings size={24} />
                    </Link>
                    <Link href="/" className="text-[10px] font-black border border-[#1B263B]/20 px-6 py-2 rounded-full hover:bg-[#590202] hover:text-white transition-all uppercase tracking-widest">
                        EXIT TO SITE
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="xl:col-span-1 flex flex-col gap-3">

                    <Link href="/admin/dashboard" className="flex items-center gap-4 bg-[#590202] text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>

                    <Link href="/admin/users" className="block bg-white border border-[#D9B36C]/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-[#590202] hover:border-[#590202] hover:-translate-y-1 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#F2EFDF] flex items-center justify-center text-[#1B263B] group-hover:bg-white/10 group-hover:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1B263B] group-hover:text-white transition-colors">Access Control</h3>
                                <p className="text-[10px] font-bold text-[#1B263B]/50 mt-1 uppercase tracking-widest group-hover:text-white/60 transition-colors">Manage Admin Roles</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/shop" className={sidebarLinkClass}>
                        <Package size={20} className="group-hover:text-[#D9B36C] transition-colors" /> Inventory
                    </Link>

                    <Link href="/admin/customers" className={sidebarLinkClass}>
                        <Users size={20} className="group-hover:text-[#D9B36C] transition-colors" /> Customers / CRM
                    </Link>

                    {/* THE FIX: Linked to Blog Page */}
                    <Link href="/admin/blog" className={sidebarLinkClass}>
                        <FileText size={20} className="group-hover:text-[#D9B36C] transition-colors" /> Blog / Ledger
                    </Link>

                    {/* THE FIX: Linked to Contact Page */}
                    <Link href="/admin/contact" className={sidebarLinkClass}>
                        <Users size={20} className="group-hover:text-[#D9B36C] transition-colors" /> Inbox / Tickets
                    </Link>

                    <Link href="/admin/faq" className={sidebarLinkClass}>
                        <Database size={20} className="group-hover:text-[#D9B36C] transition-colors" /> FAQ Intelligence
                    </Link>

                    {/* THE FIX: Linked to Hot Deals Page */}
                    <Link href="/admin/hot-deals" className={sidebarLinkClass}>
                        <Flame size={20} className="group-hover:text-[#D9B36C] transition-colors" /> Market Volatility
                    </Link>

                </aside>

                <div className="lg:col-span-3 space-y-8">
                    <div className="admin-card border-red-500/20 shadow-red-500/5 md:w-1/2">
                        <h2 className="flex items-center gap-3 text-lg font-black uppercase mb-6 text-[#1B263B]">
                            <Database className="text-blue-600" /> System Tools
                        </h2>
                        <div className="space-y-4">
                            <Link href="/admin/seed" className="w-full bg-[#1B263B] hover:bg-blue-600 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
                                <Database size={16} /> Run Database Seeder
                            </Link>
                            {isOwner && (
                                <button
                                    onClick={handlePurge}
                                    disabled={purging}
                                    className={`w-full bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] ${purging ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <AlertOctagon size={16} />
                                    {purging ? 'EXECUTING PURGE...' : 'Purge All Data (Owner)'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}