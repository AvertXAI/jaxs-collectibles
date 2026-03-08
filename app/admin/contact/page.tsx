'use client'
import { Mail, ShieldCheck, ArrowUpRight, Inbox, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminContactManager() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Authentication Queue</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Incoming Grail Verification Requests</p>
                </div>
                <Link href="/admin/dashboard" title="Return to Dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-[#D9B36C]/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1B263B] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6">Requester</th>
                            <th className="p-6">Item Description</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#1B263B]">
                        <tr className="border-b border-[#D9B36C]/10 hover:bg-[#F2EFDF]/50 transition-colors">
                            <td className="p-6">
                                <p className="font-black">John Doe</p>
                                <p className="text-[9px] text-[#1B263B]/40">collector@gmail.com</p>
                            </td>
                            <td className="p-6 italic text-[#1B263B]/60 truncate max-w-xs">Base Set Shadowless Charizard - PSA 8 Potential</td>
                            <td className="p-6">
                                <span className="bg-[#D9B36C]/20 text-[#590202] px-3 py-1 rounded-full text-[9px] uppercase font-black">Urgent Scan</span>
                            </td>
                            <td className="p-6 text-right">
                                <button
                                    title="Review Customer Request"
                                    onClick={() => router.push('/under-construction')}
                                    className="inline-flex items-center gap-2 bg-[#1B263B] text-white px-4 py-2 rounded-lg text-[9px] uppercase tracking-widest hover:bg-[#590202] transition-all"
                                >
                                    Open Case <ArrowUpRight size={12} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="p-20 text-center opacity-20">
                    <Inbox size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest">No other requests in the vault</p>
                </div>
            </div>
        </main>
    )
}