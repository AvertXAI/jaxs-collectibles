'use client'
import { useState } from 'react'
import { Instagram, Facebook, Twitter, Menu, X, ShieldCheck, Home, Package, Vault, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { AddProductForm } from './add-product-form'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-[#F2EFDF] border-b border-[#D9B36C]/20 sticky top-0 z-[80] w-full">
            <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">

                {/* TIER 1: THE BRAND (TOP & CENTERED) */}
                <div className="text-center mb-6">
                    <Link href="/">
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#590202] hover:text-[#1B263B] transition-all duration-300">
                            JAX'S COLLECTIBLES
                        </h1>
                    </Link>
                </div>

                {/* TIER 2: UTILITIES (SOCIALS LEFT, MENU RIGHT) */}
                <div className="flex justify-between items-center border-t border-[#D9B36C]/10 pt-4">

                    {/* SOCIALS - LEFT ALIGNED */}
                    <div className="flex gap-4 md:gap-6 text-[#1B263B]/60">
                        <a href="#" className="hover:text-[#590202] transition-transform hover:scale-125"><Instagram size={18} /></a>
                        <a href="#" className="hover:text-[#590202] transition-transform hover:scale-125"><Facebook size={18} /></a>
                        <a href="#" className="hover:text-[#590202] transition-transform hover:scale-125"><Twitter size={18} /></a>
                    </div>

                    {/* ACTION CLUSTER - RIGHT ALIGNED */}
                    <div className="flex items-center gap-3">
                        {/* Desktop Only Button */}
                        <div className="hidden md:block">
                            <AddProductForm />
                        </div>

                        {/* THE DROPDOWN TOGGLE */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 bg-[#1B263B] text-[#F2EFDF] px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#590202] transition-all active:scale-95 shadow-lg"
                        >
                            {isOpen ? <X size={16} /> : <Menu size={16} />}
                            <span>{isOpen ? "Close" : "Menu"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DROPDOWN MENU PANEL */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-[#D9B36C]/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* COLUMN 1: NAVIGATION */}
                        <div className="flex flex-col gap-5">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D9B36C] mb-2">Vault Navigation</p>
                            <Link href="/" onClick={() => setIsOpen(false)} className="group flex items-center gap-4 text-xl font-black text-[#1B263B] hover:text-[#590202] transition-all">
                                <Home size={20} className="group-hover:rotate-12 transition-transform" /> HOME
                            </Link>
                            <Link href="/products" onClick={() => setIsOpen(false)} className="group flex items-center gap-4 text-xl font-black text-[#1B263B] hover:text-[#590202] transition-all">
                                <Package size={20} className="group-hover:rotate-12 transition-transform" /> ALL PRODUCTS
                            </Link>
                            <Link href="/admin/seed" onClick={() => setIsOpen(false)} className="group flex items-center gap-4 text-xl font-black text-[#1B263B] hover:text-[#590202] transition-all">
                                <Vault size={20} className="group-hover:rotate-12 transition-transform" /> DATABASE SEEDER
                            </Link>
                        </div>

                        {/* COLUMN 2: OPERATIONS */}
                        <div className="flex flex-col gap-5">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D9B36C] mb-2">Inventory Management</p>
                            <div onClick={() => setIsOpen(false)} className="hover:scale-105 transition-transform origin-left">
                                <AddProductForm />
                            </div>
                            <button className="flex items-center gap-4 text-xl font-black text-[#1B263B] hover:text-[#590202] transition-all text-left">
                                <PlusCircle size={20} /> BULK UPLOAD
                            </button>
                        </div>

                        {/* COLUMN 3: SECURITY INFO */}
                        <div className="bg-[#F2EFDF] p-8 rounded-3xl border border-[#D9B36C]/30 flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-[#590202] mb-4">
                                <ShieldCheck size={28} />
                                <span className="font-black text-sm uppercase tracking-widest">Vault Security</span>
                            </div>
                            <p className="text-[11px] text-[#1B263B]/70 font-bold leading-relaxed">
                                Every listed item is physically verified and cross-referenced with 3rd-party authentication servers.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </nav>
    )
}