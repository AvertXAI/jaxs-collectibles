// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: User management page — demo stub (no real users in boilerplate)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/admin/users/page.tsx
// -----------------------------------------------------------
import Link from 'next/link'
import { ArrowLeft, Crown, ShieldCheck } from 'lucide-react'

// User management is not applicable in the boilerplate demo (no real auth/profiles).
// Shows the demo owner identity only.
export default function UserManagement() {
    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">User Directory</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Boilerplate Demo — Single Owner Session</p>
                </div>
                <Link href="/admin/dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-[#D9B36C]/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1B263B] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6">User ID</th>
                            <th className="p-6">Email / Identifier</th>
                            <th className="p-6">Current Role</th>
                            <th className="p-6 text-right">Access Control</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#1B263B]">
                        <tr className="border-b border-[#D9B36C]/10">
                            <td className="p-6 text-[10px] font-mono text-[#1B263B]/50">demo-admin</td>
                            <td className="p-6">admin@jaxscollectibles.com</td>
                            <td className="p-6">
                                <span className="flex items-center gap-2 text-[#590202] font-black">
                                    <Crown size={14} /> OWNER (GOD MODE)
                                </span>
                            </td>
                            <td className="p-6 text-right">
                                <span className="flex items-center justify-end gap-2 text-[10px] font-black text-[#1B263B]/40 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-emerald-600" /> Immutable
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="p-6 border-t border-[#D9B36C]/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/30">
                        User management is disabled in boilerplate demo mode.
                    </p>
                </div>
            </div>
        </main>
    )
}
