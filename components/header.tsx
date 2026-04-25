// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Site header — auth removed for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: components/header.tsx
// -----------------------------------------------------------
'use client'
import { usePathname } from 'next/navigation'
import { Search, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const pathname = usePathname()
  const { cart, isCartOpen, setCartOpen } = useCart()

  // Hide header inside Admin/Vault routes
  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio') || pathname.startsWith('/admin')
  if (isStudioView) return null

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-[#D9B36C]/20 shadow-sm">

      {/* ======================================================= */}
      {/* DESKTOP HEADER                                          */}
      {/* ======================================================= */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 max-w-[1800px] mx-auto w-full">
        {/* 1. LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-20 h-20 flex items-center justify-center">
            <NextImage
              src="/logo.png"
              alt="Jax's Collectibles"
              width={80}
              height={80}
              style={{ width: 'auto', height: 'auto' }}
              className="drop-shadow-md group-hover:scale-110 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.8]">Jax's</span>
            <span className="text-2xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.8]">Collectibles</span>
          </div>
        </Link>

        {/* 2. CENTER: NAV LINKS */}
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#1B263B] hover:text-[#590202] transition-colors">Home</Link>
          <Link href="/shop" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#1B263B] hover:text-[#590202] transition-colors">Shop</Link>
          <Link href="/under-construction" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#1B263B] opacity-50 hover:opacity-100 transition-opacity">Blog</Link>
          <Link href="/under-construction" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#1B263B] opacity-50 hover:opacity-100 transition-opacity">Contact Us</Link>
          <Link href="/under-construction?filter=hot" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#590202] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#590202] rounded-full animate-ping"></span> Hot Deals
          </Link>
        </nav>

        {/* 3. RIGHT: UTILITIES */}
        <div className="flex items-center gap-6">
          <Link href="/search" className="text-[#1B263B] hover:text-[#590202] transition-colors"><Search size={22} /></Link>
          <button onClick={() => setCartOpen(!isCartOpen)} className="relative text-[#1B263B] hover:text-[#590202] transition-colors p-1">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#590202] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link href="/under-construction" className="hover:text-[#590202]"><Heart size={22} /></Link>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MOBILE HEADER                                           */}
      {/* ======================================================= */}
      <div className="flex lg:hidden flex-col w-full">
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <NextImage
                src="/logo.png"
                alt="Jax's Collectibles"
                width={80}
                height={80}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.9]">Jax's</span>
              <span className="text-xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.9]">Collectibles</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-[#1B263B] flex-shrink-0">
            <Link href="/search" className="hover:text-[#590202]"><Search size={22} /></Link>
            <button onClick={() => setCartOpen(!isCartOpen)} className="relative hover:text-[#590202]">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#590202] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/under-construction" className="text-[#1B263B] hover:text-[#590202] transition-colors"><Heart size={22} /></Link>
          </div>
        </div>

        <nav className="flex items-center gap-6 px-6 py-3 border-t border-gray-100 overflow-x-auto no-scrollbar whitespace-nowrap bg-white shadow-inner">
          <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-[#590202]">Home</Link>
          <Link href="/shop" className="text-[11px] font-black uppercase tracking-widest text-[#1B263B]">Shop</Link>
          <Link href="/under-construction" className="text-[11px] font-black uppercase tracking-widest text-[#1B263B] opacity-70">Blog</Link>
          <Link href="/under-construction" className="text-[11px] font-black uppercase tracking-widest text-[#1B263B] opacity-70">Contact Us</Link>
          <Link href="/shop?filter=hot" className="text-[11px] font-black uppercase tracking-widest text-[#590202] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#590202] rounded-full animate-ping"></span> Hot Deals
          </Link>
        </nav>
      </div>
    </header>
  )
}
