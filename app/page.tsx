//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/page.tsx
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSupabase } from '@/components/supabase-provider'

const ITEMS_PER_PAGE = 8;

export default function StorefrontHome() {
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

      <section className="relative bg-[#0a0a0a] text-white py-24 md:py-32 overflow-hidden border-b-4 border-[#D9B36C]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#1B263B]/80 to-transparent"></div>

        <div className="container mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#D9B36C]/20 text-[#D9B36C] px-4 py-2 rounded-full border border-[#D9B36C]/30 mb-8 shadow-sm backdrop-blur-sm">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Authenticated Vault Access</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic text-[#D9B36C] uppercase tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
              Secure The <br /> <span className="text-white">Unobtainable</span>
            </h1>
            <p className="text-lg md:text-xl text-[#F2EFDF]/80 font-bold mb-10 leading-relaxed max-w-md drop-shadow-lg">
              The premiere destination for high-asset memorabilia and authenticated collectibles. Every item secured, every transaction verified.
            </p>

            <Link href="/shop" className="inline-flex bg-[#590202] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#D9B36C] hover:text-[#1B263B] transition-all shadow-2xl items-center gap-3">
              Enter The Vault <ArrowRight size={20} />
            </Link>
          </div>

          <div className="relative h-[600px] hidden lg:block xl:pl-28 translate-x-12">
            <div className="grid grid-cols-6 grid-rows-6 gap-4 h-full transform scale-105">

              <Link href="/shop/demo-guitar" className="col-span-3 row-span-4 bg-white rounded-3xl overflow-hidden border-4 border-[#D9B36C]/30 shadow-2xl relative rotate-6 origin-bottom-right transition-transform hover:rotate-2 block z-10">
                <Image src="/4-2.jpg" alt="Vintage Guitar" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-[#D9B36C]/20">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#1B263B]">Authentic</span>
                </div>
              </Link>

              <Link href="/shop/demo-batman" className="col-span-3 row-span-3 bg-white rounded-3xl overflow-hidden border-4 border-[#D9B36C]/30 shadow-2xl relative -translate-x-8 -rotate-12 translate-y-8 origin-top-left transition-transform hover:-rotate-3 block z-20">
                <Image src="/4-3.jpg" alt="Collectible Figure" fill className="object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-[#D9B36C]/20">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#1B263B]">Verified</span>
                </div>
              </Link>

              <Link href="/shop/demo-cards" className="col-span-2 row-span-3 bg-white rounded-3xl overflow-hidden border-4 border-[#D9B36C]/30 shadow-2xl relative translate-x-16 rotate-6 transition-transform hover:rotate-2 block z-30">
                <Image src="/4-4.jpg" alt="Rare Cards" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-[#D9B36C]/20">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#1B263B]">Vault Locked</span>
                </div>
              </Link>

              {/* THE FIX: Changed -translate-y-12 to -translate-y-32 to pull it up to the guitar */}
              <Link href="/shop/demo-comics" className="col-span-5 row-span-2 bg-white rounded-3xl overflow-hidden border-4 border-[#D9B36C]/30 shadow-2xl relative -translate-x-8 -translate-y-32 -rotate-3 transition-transform hover:rotate-0 block z-40 min-h-[220px]">
                <Image src="/4-1.jpg" alt="Comics" fill className="object-cover object-top" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-[#D9B36C]/20">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#1B263B]">Asset Secured</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-[#D9B36C]/20 shadow-sm relative z-20">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['TCG / Cards', 'First Edition Comics', 'Statues & Figures'].map((category) => (
            <Link key={category} href={`/shop?cat=${category.toLowerCase()}`} className="bg-[#F2EFDF] border border-[#D9B36C]/30 p-8 rounded-2xl text-center hover:bg-[#1B263B] hover:text-[#D9B36C] hover:-translate-y-1 transition-all group shadow-sm">
              <h3 className="font-black uppercase tracking-widest text-lg text-[#1B263B] group-hover:text-[#D9B36C] transition-colors">{category}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#590202] group-hover:text-white mt-2 transition-colors">View Sector</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 container mx-auto px-8 max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#D9B36C]/30 pb-6 gap-6">
          <div>
            <h2 className="text-3xl font-black italic text-[#590202] uppercase tracking-tighter">Trending Assets</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Recently Added to the Vault</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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