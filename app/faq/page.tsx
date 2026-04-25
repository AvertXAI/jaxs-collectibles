// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Public FAQ page — rewired to JSON flat-file store via /api/faq
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/faq/page.tsx
// -----------------------------------------------------------
'use client'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react'

export default function PublicFAQ() {
    const [faqs, setFaqs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [openId, setOpenId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchFaqs() {
            try {
                const res = await fetch('/api/faq')
                const data = await res.json()
                setFaqs(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to load Intelligence:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchFaqs()
    }, [])

    return (
        <main className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
            <div className="container mx-auto px-8 max-w-4xl">

                <header className="mb-16 text-center">
                    <div className="w-20 h-20 bg-[#F2EFDF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#D9B36C]/20">
                        <LifeBuoy size={36} className="text-[#590202]" />
                    </div>
                    <h1 className="text-5xl font-black italic text-[#1B263B] uppercase tracking-tighter mb-4">Support & Intel</h1>
                    <p className="text-xs font-black text-[#1B263B]/60 uppercase tracking-[0.3em]">Collector Knowledge Base</p>
                </header>

                {loading ? (
                    <div className="text-center font-black animate-pulse text-[#590202] uppercase tracking-widest py-20">
                        Syncing Knowledge Base...
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl border border-[#D9B36C]/20 shadow-sm">
                        <p className="font-bold text-[#1B263B]/60 uppercase tracking-widest">No Intelligence Briefings Available.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white border border-[#D9B36C]/20 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-[#D9B36C]/50">
                                <div
                                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                    className="cursor-pointer p-6 md:p-8 flex justify-between items-center hover:bg-[#F2EFDF]/20 transition-colors"
                                >
                                    <h3 className="font-black text-[#1B263B] uppercase tracking-tight pr-8 md:text-lg">
                                        {faq.question}
                                    </h3>
                                    <div className="text-[#590202] flex-shrink-0 bg-[#F2EFDF] p-2 rounded-full">
                                        {openId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                                {openId === faq.id && (
                                    <div className="bg-[#FDFBF7] p-6 md:p-8 border-t border-[#D9B36C]/10 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <p className="text-[#1B263B]/80 font-bold leading-relaxed whitespace-pre-wrap">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}
