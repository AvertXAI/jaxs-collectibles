// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Search page — rewired to JSON flat-file store via /api/products
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/search/page.tsx
// -----------------------------------------------------------
'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck, Search as SearchIcon } from 'lucide-react'

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!query.trim()) { setProducts([]); return; }
            setLoading(true)
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`)
                const { products: data } = await res.json()
                setProducts(data || [])
            } catch (error) {
                console.error("Vault search error:", error)
            } finally {
                setLoading(false)
            }
        }, 300)
        return () => clearTimeout(delay)
    }, [query])

    return (
        <>
            <section className="bg-white py-16 border-b border-[#D9B36C]/20 shadow-sm pt-32">
                <div className="container mx-auto px-8 relative z-10 text-center max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-black italic text-[#590202] uppercase tracking-tighter mb-8">
                        Search The Vault
                    </h1>

                    <div className="relative max-w-2xl mx-auto">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D9B36C]" size={24} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, category, or era..."
                            className="w-full bg-[#FDFBF7] border-2 border-[#D9B36C]/30 text-[#1B263B] rounded-2xl py-6 pl-16 pr-8 text-lg font-black outline-none focus:border-[#590202] transition-colors shadow-sm"
                        />
                    </div>

                    <p className="text-[10px] text-[#D9B36C] font-black uppercase tracking-[0.3em] mt-6">
                        {loading ? "Scanning Ledger..." : `Showing ${products.length} Authenticated Assets`}
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-8 max-w-7xl">
                {loading ? (
                    <div className="py-20 text-center font-black animate-pulse text-[#590202] uppercase tracking-widest text-xl">
                        Processing Query...
                    </div>
                ) : products.length === 0 && query ? (
                    <div className="py-32 text-center border-2 border-dashed border-[#D9B36C]/40 rounded-3xl">
                        <p className="font-black text-[#1B263B]/40 uppercase tracking-widest">No assets match your clearance criteria.</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => {
                            let displayImg = '/logo.png';
                            if (Array.isArray(product.images) && product.images.length > 0) displayImg = product.images[0];
                            else if (typeof product.images === 'string') {
                                try { displayImg = JSON.parse(product.images)[0]; } catch (e) { displayImg = product.images; }
                            } else if (product.image_url) { displayImg = product.image_url; }

                            return (
                                <div key={product.id} className="bg-white rounded-2xl border border-[#D9B36C]/30 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
                                    <div className="h-64 bg-[#F2EFDF] relative overflow-hidden flex items-center justify-center p-4">
                                        <Image
                                            src={displayImg}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-4"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-[#D9B36C]/20">
                                            <ShieldCheck size={14} className="text-emerald-600" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-[#1B263B]">Verified</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow border-t border-[#D9B36C]/20">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#D9B36C] mb-2">{product.category || 'General'}</span>
                                        <h3 className="font-black text-[#1B263B] uppercase leading-tight mb-4 flex-grow text-sm">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#D9B36C]/10">
                                            <span className="text-xl font-black text-[#590202]">${product.price}</span>
                                            <Link href={`/shop/${product.slug || product.id}`} className="bg-[#1B263B] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#D9B36C] hover:text-[#1B263B] transition-colors">
                                                Inspect
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </section>
        </>
    );
}

export default function SearchVault() {
    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center font-black text-[#590202] uppercase tracking-widest">
                    Initializing Search Interface...
                </div>
            }>
                <SearchContent />
            </Suspense>
        </main>
    )
}
