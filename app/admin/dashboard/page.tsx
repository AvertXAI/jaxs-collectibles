'use client'
import { PlusCircle, Database, LayoutDashboard, Package, Users, Settings, Flame, User } from 'lucide-react'
import Link from 'next/link'
import { AddProductForm } from '@/components/admin/add-product-form'

export default function AdminDashboard() {
    return (
        <main className="min-h-screen admin-bg p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#D9B36C]/30 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[#590202]">Vault Control Center</h1>
                    <p className="text-[#1B263B]/60 text-xs font-bold uppercase tracking-[0.3em] mt-1">Authorized Personnel Only</p>
                </div>
                <Link href="/" className="text-[10px] font-black border border-[#1B263B]/20 px-6 py-2 rounded-full hover:bg-[#590202] hover:text-white transition-all uppercase tracking-widest">EXIT TO SITE</Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR NAVIGATION - REPLACED WITH NEW LINK LOGIC */}
                <aside className="xl:col-span-1 flex flex-col gap-3">
                    <Link href="/admin/dashboard" className="flex items-center gap-4 bg-[#590202] text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    {/* USER MANAGEMENT LINK */}
                    <Link href="/admin/users" className="block bg-white border border-[#D9B36C]/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#D9B36C] hover:-translate-y-1 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#F2EFDF] flex items-center justify-center text-[#1B263B] group-hover:bg-[#590202] group-hover:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1B263B]">Access Control</h3>
                                <p className="text-[10px] font-bold text-[#1B263B]/50 mt-1 uppercase tracking-widest">Manage Admin Roles & Users</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/admin/shop" className="flex items-center gap-4 bg-white border border-[#D9B36C]/20 hover:bg-[#F2EFDF] text-[#1B263B] p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                        <Package size={20} /> Inventory
                    </Link>
                    <Link href="/admin/contact" className="flex items-center gap-4 bg-white border border-[#D9B36C]/20 hover:bg-[#F2EFDF] text-[#1B263B] p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                        <Users size={20} /> Customers / Inbox
                    </Link>
                    <Link href="/admin/hot-deals" className="flex items-center gap-4 bg-white border border-[#D9B36C]/20 hover:bg-[#F2EFDF] text-[#1B263B] p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                        <Flame size={20} /> Hot Deals
                    </Link>
                </aside>

                {/* MAIN CONTROL AREA */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* QUICK ACTIONS: ADD PRODUCT */}
                        <div className="admin-card">
                            <h2 className="flex items-center gap-3 text-lg font-black uppercase mb-6 text-[#1B263B]">
                                <PlusCircle className="text-[#590202]" /> Add New Asset
                            </h2>
                            <AddProductForm />
                        </div>

                        {/* SYSTEM TOOLS */}
                        <div className="admin-card">
                            <h2 className="flex items-center gap-3 text-lg font-black uppercase mb-6 text-[#1B263B]">
                                <Database className="text-blue-600" /> System Tools
                            </h2>
                            <button className="w-full bg-[#1B263B] hover:bg-[#590202] text-white font-black py-5 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
                                RUN DATABASE SEEDER
                            </button>
                            <p className="text-[9px] text-[#1B263B]/40 mt-6 font-bold uppercase leading-relaxed tracking-widest">
                                Warning: Seeding will overwrite existing local metadata cache.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}