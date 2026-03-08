//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useState } from 'react'
import { Instagram, Facebook, Twitter, Menu, X, Search, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="vault-header">
            {/* TIER 1: BRAND IDENTITY (BLOCK FLEX) */}
            <div className="brand-row">
                <Link href="/">
                    <span className="brand-text">JAX'S COLLECTIBLES</span>
                </Link>
            </div>

            {/* TIER 2: NAV UTILITIES (JUSTIFIED FLEX) */}
            <div className="utility-row">
                {/* SOCIALS - START (LEFT) */}
                <div className="flex items-center gap-5 text-[#1B263B]/60">
                    <a href="#" className="hover:text-[#590202]"><Instagram size={18} /></a>
                    <a href="#" className="hover:text-[#590202]"><Facebook size={18} /></a>
                    <a href="#" className="hover:text-[#590202]"><Twitter size={18} /></a>
                </div>

                {/* MENU - END (RIGHT) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="menu-trigger"
                >
                    {isOpen ? <X size={14} /> : <Menu size={14} />}
                    <span>{isOpen ? "Close" : "Menu"}</span>
                </button>
            </div>

            {/* DROPDOWN DRAWER (ABSOLUTE TO PREVENT CONTENT JUMP) */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-[#D9B36C]/20 shadow-2xl p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        <div className="flex flex-col gap-5">
                            <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-black text-[#1B263B] hover:text-[#590202]">HOME</Link>
                            <Link href="/products" onClick={() => setIsOpen(false)} className="text-2xl font-black text-[#1B263B] hover:text-[#590202]">ALL PRODUCTS</Link>
                            <Link href="/admin/seed" onClick={() => setIsOpen(false)} className="text-2xl font-black text-[#1B263B] hover:text-[#590202]">SEED VAULT</Link>
                        </div>

                        <div className="pt-6 border-t border-[#D9B36C]/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C] mb-4">Search the Collection</p>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search 50 rare items..."
                                    className="w-full bg-[#F2EFDF] rounded-xl p-4 text-sm outline-none border border-[#D9B36C]/20"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D9B36C]" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}