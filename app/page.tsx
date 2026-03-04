"use client";
import { useState } from 'react';
import { Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { AddProductForm } from '@/components/add-product-form';

export default function Home() {
  const [showModal, setShowModal] = useState(true);

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-600">
      {/* EMAIL CAPTURE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-white text-black max-w-lg w-full p-10 relative shadow-[0_0_50px_rgba(168,85,247,0.4)]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-2xl hover:scale-125 transition-transform">✕</button>
            <div className="text-center">
              <h2 className="text-5xl font-black italic tracking-tighter mb-2">SAVE 15%</h2>
              <p className="text-sm uppercase tracking-[0.2em] font-bold text-gray-500 mb-8 text-balance">On your first autographed vault item</p>
              <input type="email" placeholder="ENTER EMAIL" className="w-full border-b-2 border-black p-4 mb-6 text-xl focus:outline-none focus:border-purple-600 transition-colors" />
              <button className="w-full bg-black text-white py-5 font-black text-2xl italic hover:bg-purple-700 transition-all">GET MY CODE</button>
              <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">Single use only. Terms apply.</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER WITH SOCIALS */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex gap-4">
          <a href="https://instagram.com/client" className="hover:text-purple-500 transition-colors"><Instagram size={20} /></a>
          <a href="https://facebook.com/client" className="hover:text-purple-500 transition-colors"><Facebook size={20} /></a>
          <a href="https://twitter.com/client" className="hover:text-purple-500 transition-colors"><Twitter size={20} /></a>
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter">JAX'S COLLECTIBLES</h1>
        <div className="flex items-center gap-4">
          <AddProductForm />
          <button className="border border-white/20 px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">The Vault</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none mb-6">OWN THE <span className="text-purple-600">LEGACY.</span></h2>
        <p className="text-gray-400 max-w-2xl text-lg mb-10 leading-relaxed">Verified autographed memorabilia with 3rd-party authentication. Secured by Visa & Mastercard Identity Check.</p>
        <div className="flex gap-4 items-center bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <ShieldCheck className="text-emerald-500" size={18} />
          <span className="text-xs font-bold tracking-widest uppercase">Verified by Visa & Mastercard</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="p-10 border-t border-white/10 text-center mt-20">
        <p className="text-[10px] text-gray-600 mb-6 tracking-[0.3em]">© 2026 JAX'S COLLECTIBLES | 5% TRANSACTION FEE APPLIES</p>
        <div className="flex justify-center gap-8 opacity-40">
          <Instagram size={18} /> <Facebook size={18} /> <Twitter size={18} />
        </div>
      </footer>
    </main>
  );
}