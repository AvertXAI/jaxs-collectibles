'use client'
import { useState } from 'react'
import { Instagram, Facebook, Twitter, Menu, X, Search, Shield } from 'lucide-react'
import Link from 'next/link'

// RENAMED TO Header to match your layout.tsx import
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="vault-header w-full bg-[#F2EFDF] border-b border-[#D9B36C]/20 sticky top-0 z-[100]">
      {/* TIER 1: BRAND IDENTITY */}
      <div className="brand-tier py-6 border-b border-[#D9B36C]/10">
        <Link href="/" className="flex justify-center">
          <span className="brand-text text-3xl md:text-6xl font-black italic tracking-tighter text-[#590202] uppercase text-center">
            JAX'S COLLECTIBLES
          </span>
        </Link>
      </div>

      {/* TIER 2: NAV UTILITIES (Strict Flexbox for Mobile & Tablet) */}
      <div className="utility-tier flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        {/* SOCIALS (PINNED LEFT) */}
        <div className="flex items-center gap-4 text-[#1B263B]/60">
          <a href="#" className="hover:text-[#590202] transition-all"><Instagram size={18} /></a>
          <a href="#" className="hover:text-[#590202] transition-all"><Facebook size={18} /></a>
          <a href="#" className="hover:text-[#590202] transition-all"><Twitter size={18} /></a>
        </div>

        {/* ACTIONS (PINNED RIGHT) */}
        <div className="flex items-center gap-3">
          {/* Magnifying Glass to Search Page */}
          <Link
            href="/search"
            className="p-2.5 bg-white border border-[#D9B36C]/30 rounded-full text-[#1B263B] hover:bg-[#590202] hover:text-white transition-all shadow-sm flex items-center justify-center"
            aria-label="Search the Vault"
          >
            <Search size={18} />
          </Link>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="menu-btn bg-[#1B263B] text-[#F2EFDF] px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="hidden sm:inline">{isOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* DROPDOWN DRAWER */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[#D9B36C]/20 shadow-2xl p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-5 text-2xl font-black text-[#1B263B]">
              <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#590202]">HOME</Link>
              <Link href="/products" onClick={() => setIsOpen(false)} className="hover:text-[#590202]">ALL PRODUCTS</Link>
              <Link href="/search" onClick={() => setIsOpen(false)} className="hover:text-[#590202]">SEARCH VAULT</Link>
              <Link href="/admin/seed" onClick={() => setIsOpen(false)} className="hover:text-[#590202]">SEED VAULT</Link>
            </div>

            <div className="pt-6 border-t border-[#D9B36C]/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C] mb-4">Quick Search the Collection</p>
              <div className="relative">
                <form action="/search" method="GET">
                  <input
                    name="q"
                    type="text"
                    placeholder="Search 50 rare items..."
                    className="w-full bg-[#F2EFDF] rounded-xl p-4 text-sm outline-none border border-[#D9B36C]/20 focus:border-[#590202] transition-colors text-black"
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D9B36C] hover:text-[#590202]">
                    <Search size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}