"use client";
import { useState } from 'react';
import { Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import ShopGrid from '@/components/shop-grid';

export default function Home() {
  const [showModal, setShowModal] = useState(true);

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
              <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">Single use only. Terms apply.</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER IS NOW IN layout.tsx */}
      
      {/* HERO SECTION */}
      <section className="py-24 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6">
          OWN THE <span className="text-[#590202]">LEGACY.</span>
        </h2>
        <p className="text-[#1B263B]/60 max-w-2xl text-lg mb-10 leading-relaxed font-medium">
          Verified autographed memorabilia with 3rd-party authentication. Secured by Visa & Mastercard Identity Check.
        </p>
        <div className="flex gap-4 items-center bg-white px-6 py-3 rounded-full border border-[#D9B36C]/30 shadow-sm">
          <ShieldCheck className="text-emerald-500" size={18} />
          <span className="text-xs font-bold tracking-widest uppercase">Verified by Visa & Mastercard</span>
        </div>
      </section>

      {/* SHOP GRID SECTION */}
      <div className="bg-white/50 backdrop-blur-sm">
        <ShopGrid />
      </div>

      {/* FOOTER */}
      <footer className="p-20 border-t border-[#D9B36C]/20 text-center bg-[#1B263B] text-[#F2EFDF]">
        <p className="text-[10px] mb-6 tracking-[0.3em] uppercase font-bold">© 2026 JAX'S COLLECTIBLES | 5% TRANSACTION FEE APPLIES</p>
        <div className="flex justify-center gap-8 opacity-60">
          <Instagram size={18} /> <Facebook size={18} /> <Twitter size={18} />
        </div>
      </footer>
    </main>
  );
}