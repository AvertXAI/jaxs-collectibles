//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/shop/page.tsx
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, ChevronLeft, ChevronRight, Layout } from 'lucide-react'
import { useSupabase } from '@/components/supabase-provider'

const ITEMS_PER_PAGE = 12;

export default function ShopDirectory() {
    const supabase = useSupabase();

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        async function fetchVaultAssets() {
            setLoading(true)
            try {
                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                const { data, error, count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) throw error;

                setProducts(data || []);
                if (count) {
                    setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
                }
            } catch (error) {
                console.error("Vault retrieval error:", error);
            } finally {
                setLoading(false);
            }
        }
        if (supabase) fetchVaultAssets();
    }, [page, supabase])

    return (
        <main className="min-h-screen bg-[#FDFBF7]">

            <section className="bg-[#1B263B] text-white py-16 border-b-4 border-[#D9B36C]">
                <div className="container mx-auto px-8 relative z-10 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-black italic text-[#D9B36C] uppercase tracking-tighter mb-4">
                        Vault Inventory
                    </h1>
                    <p className="text-sm md:text-base text-[#F2EFDF]/70 font-bold leading-relaxed">
                        Browse the complete ledger of authenticated assets. All items are secured in climate-controlled facilities pending acquisition.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-8 max-w-7xl">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#D9B36C]/30 pb-6 gap-6">
                    <div className="flex items-center gap-4">
                        <Layout className="text-[#590202]" size={32} />
                        <div>
                            <h2 className="text-3xl font-black italic text-[#590202] uppercase tracking-tighter">All Sectors</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-1">Live Asset Ledger</p>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/50">Jump to Page:</span>
                            <select
                                value={page}
                                onChange={(e) => setPage(Number(e.target.value))}
                                className="bg-[#1B263B] text-white rounded-xl py-3 px-4 text-sm font-black outline-none cursor-pointer hover:bg-[#590202] transition-all border-none shadow-md"
                            >
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>Page {num}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className="py-32 text-center font-black animate-pulse text-[#590202] uppercase tracking-widest text-xl">
                        Unlocking Vault Inventory...
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-[#D9B36C]/40 rounded-3xl">
                        <p className="font-black text-[#1B263B]/40 uppercase tracking-widest">Vault is Currently Empty.</p>
                    </div>
                ) : (
                    <>
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

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-16 pt-8 border-t border-[#D9B36C]/20">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-2 px-6 py-4 bg-white border border-[#D9B36C]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1B263B] disabled:opacity-30 hover:bg-[#F2EFDF] transition-all shadow-sm"
                                >
                                    <ChevronLeft size={16} /> Prev Page
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B263B]/60">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-2 px-6 py-4 bg-[#1B263B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-[#590202] transition-all shadow-md"
                                >
                                    Next Page <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    )
}