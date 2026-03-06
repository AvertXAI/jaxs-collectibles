'use client'
import { useState } from 'react'
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image' // Fixes the JSX component error

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="vault-header">
      <div className="header-container">

        {/* 1. LEFT: THE LOGO + TEXT (Uses .header-brand for flex-1) */}
        <Link href="/" className="header-brand group">
          <div className="relative w-16 md:w-20 aspect-square">
            <NextImage
              src="/logo.png"
              alt="Jax's Collectibles Logo"
              fill
              className="object-contain drop-shadow-md group-hover:scale-110 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-3xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.8] hidden sm:block">
              Jax's
            </span>
            <span className="text-xl md:text-3xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.8] hidden sm:block">
              Collectibles
            </span>
          </div>
        </Link>

        {/* 2. CENTER: NAV (Uses .header-nav for flex-[2] centering) */}
        <nav className="header-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="#" className="nav-link opacity-30 cursor-not-allowed">Blog</Link>
          <Link href="#" className="nav-link opacity-30 cursor-not-allowed">Contact</Link>
          <Link href="/shop?filter=hot" className="nav-link text-[#590202] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#590202] rounded-full animate-ping"></span>
            Hot Deal
          </Link>
        </nav>

        {/* 3. RIGHT: UTILITIES (Uses .header-utilities for flex-1) */}
        <div className="header-utilities">
          <div className="flex items-center gap-6 border-r border-[#D9B36C]/30 pr-8 hidden md:flex">
            <Link href="/search" className="hover:text-[#590202] transition-colors"><Search size={22} /></Link>
            <Link href="/cart" className="relative hover:text-[#590202] transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-[#590202] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </Link>
            <Link href="/wishlist" className="hover:text-[#590202] transition-colors">
              <Heart size={22} />
            </Link>
          </div>

          <Link href="/auth" className="flex items-center gap-3 hover:text-[#590202] transition-colors">
            <User size={22} />
            <span className="hidden xl:inline text-[10px] font-black uppercase tracking-[0.2em]">Login / Join</span>
          </Link>

          {/* MOBILE MENU TRIGGER */}
          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  )
}