'use client'
import { PlusCircle, Database, LayoutDashboard, Package, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { AddProductForm } from '@/components/add-product-form' // Adjust path if needed

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">Vault Control Center</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Authorized Personnel Only</p>
                </div>
                <Link href="/" className="text-[10px] font-black border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all">EXIT TO SITE</Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* SIDEBAR NAVIGATION */}
                <aside className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 bg-white text-black p-4 rounded-xl font-bold text-sm"><LayoutDashboard size={18} /> Dashboard</button>
                    <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-xl font-bold text-sm text-zinc-400"><Package size={18} /> Inventory</button>
                    <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-xl font-bold text-sm text-zinc-400"><Users size={18} /> Customers</button>
                    <button className="flex items-center gap-3 hover:bg-white/5 p-4 rounded-xl font-bold text-sm text-zinc-400"><Settings size={18} /> Settings</button>
                </aside>

                {/* MAIN CONTROL AREA */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* QUICK ACTIONS */}
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
                            <h2 className="flex items-center gap-3 text-lg font-black uppercase mb-6"><PlusCircle className="text-emerald-500" /> Add New Asset</h2>
                            <AddProductForm />
                        </div>

                        <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5">
                            <h2 className="flex items-center gap-3 text-lg font-black uppercase mb-6"><Database className="text-blue-500" /> System Tools</h2>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3">
                                RUN DATABASE SEEDER
                            </button>
                            <p className="text-[10px] text-zinc-500 mt-4 font-bold uppercase leading-relaxed">Warning: Seeding will overwrite existing local metadata cache.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}