'use client'
import { PenLine, Eye, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'

export default function AdminBlogManager() {
    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Ledger Management</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Draft and Publish Authenticity Reports</p>
                </div>
                <button className="bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all flex items-center gap-2">
                    <PenLine size={14} /> Create New Post
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {/* MOCK POST ROW */}
                <div className="bg-white p-6 rounded-2xl border border-[#D9B36C]/20 flex items-center justify-between group hover:shadow-lg transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#F2EFDF] rounded-lg flex items-center justify-center text-[#D9B36C]">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-[#1B263B] uppercase">The Science of 1st Edition Authentication</h3>
                            <p className="text-[9px] font-bold text-[#D9B36C] uppercase tracking-widest">Status: Draft | Last Edited: 2 Hours Ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-[#F2EFDF] text-[#1B263B] rounded-lg hover:text-[#590202]"><Eye size={18} /></button>
                        <button className="p-3 bg-[#F2EFDF] text-[#1B263B] rounded-lg hover:text-[#590202]"><PenLine size={18} /></button>
                        <button className="p-3 bg-[#F2EFDF] text-[#590202] rounded-lg hover:bg-[#590202] hover:text-white transition-colors"><Trash2 size={18} /></button>
                    </div>
                </div>
            </div>
        </main>
    )
}