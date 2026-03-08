//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'

// Public Supabase Connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ITEMS_PER_PAGE = 8; // Forcing the 8-item grid limit

export default function StorefrontHome() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination State
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchVaultAssets() {
      setLoading(true)
      try {
        // Calculate range for pagination
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        // Fetch with exact count to calculate total pages
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
    fetchVaultAssets()
  }, [page])

  return (
    <main className="min-h-screen bg-[#FDFBF7]">

      {/* HERO SECTION */}
      <section className="relative bg-[#1B263B] text-white py-32 overflow-hidden border-b-4 border-[#D9B36C]">
        <div className="absolute inset-0 opacity-10 bg-[url('/construction-barrier.png')] bg-repeat opacity-5"></div>
        <div className="container mx-auto px-8 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black italic text-[#D9B36C] uppercase tracking-tighter mb-6">
            Secure The Unobtainable
          </h1>
          <p className="text-lg md:text-xl text-[#F2EFDF]/80 font-bold mb-10 leading-relaxed">
            The premiere destination for high-asset memorabilia and authenticated collectibles. Every item secured, every transaction verified.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="w-full md:w-auto bg-[#590202] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#D9B36C] hover:text-[#1B263B] transition-all shadow-xl flex items-center justify-center gap-2">
              Enter The Vault <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTOR QUICK LINKS */}
      <section className="py-12 bg-white border-b border-[#D9B36C]/20 shadow-sm">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['TCG / Cards', 'First Edition Comics', 'Statues & Figures'].map((category) => (
            <Link key={category} href={`/shop?cat=${category.toLowerCase()}`} className="bg-[#F2EFDF] border border-[#D9B36C]/30 p-8 rounded-2xl text-center hover:bg-[#1B263B] hover:text-[#D9B36C] hover:-translate-y-1 transition-all group shadow-sm">
              <h3 className="font-black uppercase tracking-widest text-lg text-[#1B263B] group-hover:text-[#D9B36C] transition-colors">{category}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#590202] group-hover:text-white mt-2 transition-colors">View Sector</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING ASSETS GRID */}
      <section className="py-20 container mx-auto px-8 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#D9B36C]/30 pb-6 gap-6">
          <div>
            <h2 className="text-3xl font-black italic text-[#590202] uppercase tracking-tighter">Trending Assets</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Recently Added to the Vault</p>
          </div>

          {/* PAGINATION DROPDOWN (TOP RIGHT) */}
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
            {/* 8-ITEM GRID (4 Top, 4 Bottom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-[#D9B36C]/30 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
                  <div className="h-64 bg-[#F2EFDF] relative overflow-hidden flex items-center justify-center p-4">
                    {(product.images?.[0] || product.image_url) ? (
                      <Image
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-black text-[#1B263B]/20 uppercase tracking-widest">No Image</span>
                    )}
                    {/* Verification Badge */}
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
                      <Link href={`/shop/${product.slug}`} className="bg-[#1B263B] text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#D9B36C] hover:text-[#1B263B] transition-colors">
                        Inspect
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM PAGINATION CONTROLS */}
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