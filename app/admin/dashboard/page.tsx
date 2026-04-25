// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin dashboard — isOwner hardcoded true for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/admin/dashboard/page.tsx
// -----------------------------------------------------------
'use client'
import { Database, LayoutDashboard, Package, Users, Settings, Flame, User, AlertOctagon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminDashboard() {
    // Hardcoded true — boilerplate demo always runs as owner.
    const isOwner = true
    const [purging, setPurging] = useState(false)

    const handlePurge = async () => {
        const confirm1 = window.confirm("WARNING: You are about to initiate the Purge Protocol. This will reset all inventory to the seed data. Proceed?")
        if (!confirm1) return
        const confirm2 = window.confirm("FINAL WARNING: This cannot be undone. Press OK to wipe the Vault.")
        if (confirm2) {
            setPurging(true)
            try {
                const res = await fetch('/api/admin/purge', { method: 'DELETE' })
                const result = await res.json()
                if (result.success) alert("Vault successfully purged.")
                else alert(`PURGE FAILED: ${result.error}`)
            } catch (err) {
                alert("Network failure during purge attempt.")
            } finally {
                setPurging(false)
            }
        }
    }

    const sidebarLinkClass = "flex items-center gap-4 bg-white border border-[#D9B36C]/20 hover:bg-[#590202] hover:text-white text-[#1B263B] p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group shadow-sm"

    return (
        <main className="min-h-screen admin-bg p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#D9B36C]/30 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[#590202]">Vault Control Center</h1>
                    <p className="text-[#1B263B]/60 text-xs font-bold uppercase tracking-[0.3em] mt-1">Boilerplate Demo — Full Access</p>
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
                    <Link href="/admin/users" className={sidebarLinkClass}>
                        <User size={20} /> Access Control
                    </Link>
                    <Link href="/admin/shop" className={sidebarLinkClass}>
                        <Package size={20} /> Inventory
                    </Link>
                    <Link href="/admin/customers" className={sidebarLinkClass}>
                        <Users size={20} /> Customers / CRM
                    </Link>
                    <Link href="/admin/faq" className={sidebarLinkClass}>
                        <Database size={20} /> FAQ Intelligence
                    </Link>
                    <Link href="/admin/hot-deals" className={sidebarLinkClass}>
                        <Flame size={20} /> Market Volatility
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
