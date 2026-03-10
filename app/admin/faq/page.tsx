//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/admin/faq/page.tsx
//////////////////////////////////////////////////
'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Save, Trash2, Edit3, X } from 'lucide-react'
import Link from 'next/link'

export default function FAQManager() {
    const [faqs, setFaqs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' })

    useEffect(() => { fetchFaqs() }, [])

    async function fetchFaqs() {
        const res = await fetch('/api/admin/faq');
        const data = await res.json();
        setFaqs(data || []);
        setLoading(false);
    }

    const handleSave = async () => {
        const url = '/api/admin/faq';
        const method = editingId ? 'PATCH' : 'POST';
        const payload = editingId ? { ...formData, id: editingId } : formData;

        const res = await fetch(url, {
            method,
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setFormData({ question: '', answer: '', category: 'General' });
            setEditingId(null);
            setShowForm(false);
            fetchFaqs();
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Purge this FAQ Post from the Vault?")) {
            await fetch('/api/admin/faq', {
                method: 'DELETE',
                body: JSON.stringify({ id })
            });
            fetchFaqs();
        }
    }

    const openEdit = (faq: any) => {
        setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
        setEditingId(faq.id);
        setShowForm(true);
    }

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">FAQ Intelligence</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Database-Driven Knowledge Base</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/dashboard" className="bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-[#590202] transition-colors">
                        <ArrowLeft size={14} /> Back
                    </Link>
                    <button onClick={() => { setFormData({ question: '', answer: '', category: 'General' }); setEditingId(null); setShowForm(true); }} className="bg-[#590202] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-[#1B263B] transition-colors">
                        <Plus size={14} /> Add FAQ
                    </button>
                </div>
            </header>

            {showForm && (
                <div className="bg-white p-8 rounded-3xl border border-[#D9B36C]/20 shadow-xl mb-12 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black uppercase text-[#1B263B]">{editingId ? 'Edit Intelligence' : 'New Intelligence Entry'}</h2>
                        <button onClick={() => setShowForm(false)} className="text-[#1B263B]/40 hover:text-[#590202]"><X size={24} /></button>
                    </div>
                    <div className="space-y-4">
                        <input placeholder="Question" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full bg-[#F2EFDF]/50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 ring-[#590202]" />
                        <textarea placeholder="Answer" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full bg-[#F2EFDF]/50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 ring-[#590202] h-32" />
                        <button onClick={handleSave} className="w-full bg-[#1B263B] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#590202] transition-colors">Commit to Vault</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {faqs.map(faq => (
                    <div key={faq.id} className="bg-white p-6 rounded-2xl border border-[#D9B36C]/10 flex justify-between items-center transition-all shadow-sm">
                        <div className="max-w-3xl">
                            <h3 className="font-black text-[#1B263B] uppercase tracking-tight">{faq.question}</h3>
                            <p className="text-sm text-[#1B263B]/60 mt-2 font-bold whitespace-pre-wrap">{faq.answer}</p>
                        </div>
                        {/* THE FIX: Removed opacity-0 to ensure buttons are permanently visible */}
                        <div className="flex gap-2">
                            <button onClick={() => openEdit(faq)} className="p-3 bg-[#F2EFDF] rounded-lg hover:bg-[#D9B36C] hover:text-black transition-colors" title="Edit FAQ"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(faq.id)} className="p-3 bg-[#F2EFDF] text-[#590202] rounded-lg hover:bg-[#590202] hover:text-white transition-colors" title="Purge FAQ"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}