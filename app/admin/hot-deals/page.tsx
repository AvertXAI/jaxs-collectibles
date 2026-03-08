'use client'
import { Flame, Percent, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminHotDeals() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Market Volatility</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Manage "Hot Deal" status for vault assets</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/dashboard" title="Return to Dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <button
                        title="Save all Market Volatility Settings"
                        onClick={() => router.push('/under-construction')}
                        className="bg-[#590202] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-[#1B263B] transition-all"
                    >
                        <Save size={14} /> Commit Changes
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 admin-card">
                    <div className="flex items-center gap-4 mb-6 text-[#590202]">
                        <Percent size={24} />
                        <h2 className="font-black uppercase tracking-widest text-sm">Flash Sale Override</h2>
                    </div>
                    <input type="number" placeholder="Percentage %" className="w-full bg-[#F2EFDF] rounded-xl p-4 text-sm mb-4 outline-none border-2 border-transparent focus:border-[#590202]" />
                    <button
                        title="Apply this discount to all inventory"
                        onClick={() => router.push('/under-construction')}
                        className="w-full bg-[#1B263B] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#590202] transition-all"
                    >
                        Apply Globally
                    </button>
                </div>

                <div className="md:col-span-2 admin-card overflow-hidden !p-0">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDFBF7] border-b border-[#D9B36C]/20 text-[9px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="p-4">Asset</th>
                                <th className="p-4">Current Price</th>
                                <th className="p-4">Hot Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold">
                            <tr className="border-b border-[#D9B36C]/10">
                                <td className="p-4">1st Ed Charizard</td>
                                <td className="p-4">$12,500</td>
                                <td className="p-4">
                                    <button
                                        title="Toggle item Hot/Cold status"
                                        onClick={() => router.push('/under-construction')}
                                        className="flex items-center gap-2 bg-[#590202] text-white px-3 py-1.5 rounded-full text-[8px] uppercase font-black"
                                    >
                                        <Flame size={10} /> Active
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}