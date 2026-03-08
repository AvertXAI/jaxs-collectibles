//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShieldCheck, Instagram, Facebook, Twitter } from 'lucide-react';
import InventoryGrid from "@/components/inventory-grid";
import ProductCard from "@/components/product-card";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F2EFDF] text-[#1B263B] font-sans selection:bg-[#590202] selection:text-white">

      {/* EMAIL CAPTURE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B263B]/90 backdrop-blur-md p-4">
          <div className="bg-white text-[#1B263B] max-w-lg w-full p-10 relative shadow-[0_0_50px_rgba(89,2,2,0.4)] rounded-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-2xl hover:scale-125 transition-transform">✕</button>
            <div className="text-center">
              <h2 className="text-5xl font-black italic tracking-tighter mb-2 text-[#590202]">SAVE 15%</h2>
              <p className="text-sm uppercase tracking-[0.2em] font-bold text-gray-500 mb-8">On your first autographed vault item</p>
              <input type="email" placeholder="ENTER EMAIL" className="w-full border-b-2 border-[#1B263B] p-4 mb-6 text-xl focus:outline-none focus:border-[#590202] transition-colors" />
              <button className="w-full bg-[#1B263B] text-white py-5 font-black text-2xl italic hover:bg-[#590202] transition-all rounded-xl">GET MY CODE</button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="py-20 md:py-32 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-5xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6">
          OWN THE <span className="text-[#590202]">LEGACY.</span>
        </h2>
        <div className="flex gap-4 items-center bg-white px-6 py-3 rounded-full border border-[#D9B36C]/30 shadow-sm">
          <ShieldCheck className="text-emerald-500" size={18} />
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Verified by Visa & Mastercard</span>
        </div>
      </section>

      {/* VAULT INVENTORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-black italic mb-10 tracking-tighter uppercase text-[#590202]">
          The Vault Inventory
        </h2>

        {/* This component now uses Supabase internally */}
        <InventoryGrid />

        <div className="mt-20">
          <h3 className="text-2xl font-black uppercase italic mb-8 text-[#1B263B]">Curated Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <p className="animate-pulse text-[#D9B36C]">Scanning Database...</p>
            ) : (
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="p-20 border-t border-[#D9B36C]/20 text-center bg-[#1B263B] text-[#F2EFDF]">
        <p className="text-[10px] mb-6 tracking-[0.3em] uppercase font-bold">© 2026 JAX'S COLLECTIBLES | SECURE VAULT ACCESS</p>
        <div className="flex justify-center gap-8 opacity-40">
          <Instagram size={18} /> <Facebook size={18} /> <Twitter size={18} />
        </div>
      </footer>
    </main>
  );
}