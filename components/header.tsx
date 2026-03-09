//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, ShoppingCart, User, LogOut, Heart } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const pathname = usePathname();
  const { cart, isCartOpen, setCartOpen } = useCart();
  const [user, setUser] = useState<any>(null);

  // THE AUTH MECHANIC: Instantly toggle Login/Logout icons based on session
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Hard flush the client state
  };

  // Hide header inside Admin/Vault routes
  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio') || pathname.startsWith('/admin');
  if (isStudioView) return null;

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-[#D9B36C]/20 shadow-sm">

      {/* ========================================================= */}
      {/* DESKTOP HEADER (Hidden on Mobile)                         */}
      {/* ========================================================= */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 max-w-[1800px] mx-auto w-full">
        {/* 1. LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-20 h-20">
            <NextImage src="/logo.png" alt="Jax's Collectibles" fill className="object-contain drop-shadow-md group-hover:scale-110 transition-transform" priority />
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
          <Link href="/shop?filter=hot" className="text-[13px] font-black uppercase tracking-[0.2em] text-[#590202] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#590202] rounded-full animate-ping"></span> Hot Deals
          </Link>
        </nav>

        {/* 3. RIGHT: UTILITIES */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 border-r border-[#D9B36C]/30 pr-6">
            <Link href="/search" className="text-[#1B263B] hover:text-[#590202] transition-colors"><Search size={22} /></Link>
            <button onClick={() => setCartOpen(!isCartOpen)} className="relative text-[#1B263B] hover:text-[#590202] transition-colors p-1">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#590202] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/wishlist" className="text-[#1B263B] hover:text-[#590202] transition-colors"><Heart size={22} /></Link>
          </div>

          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 text-[#1B263B] hover:text-[#590202] transition-colors" title="Logout">
              <LogOut size={22} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
            </button>
          ) : (
            <Link href="/auth" className="flex items-center gap-2 text-[#1B263B] hover:text-[#590202] transition-colors" title="Login">
              <User size={22} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Login / Join</span>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE HEADER (Visible only on md/sm screens)             */}
      {/* ========================================================= */}
      <div className="flex lg:hidden flex-col w-full">
        {/* TIER 1: BRAND & MOVED UTILITIES */}
        <div className="flex items-center justify-between px-5 py-3"> {/* Increased padding to pull off edges */}

          <Link href="/" className="flex items-center gap-3">
            {/* THE FIX: Much larger logo (w-16 h-16) + flex-shrink-0 to prevent squishing */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <NextImage src="/logo.png" alt="Jax's Collectibles" fill className="object-contain" priority />
            </div>
            {/* THE FIX: Increased text size to text-xl */}
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.9]">Jax's</span>
              <span className="text-xl font-black italic tracking-tighter text-[#590202] uppercase leading-[0.9]">Collectibles</span>
            </div>
          </Link>

          {/* THE FIX: Added gap-4 for breathing room, restored Heart icon, removed edge-bleeding */}
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

            {/* THE FIX: Removed "hidden sm:block" so the heart always shows on mobile */}
            <Link href="/wishlist" className="hover:text-[#590202]"><Heart size={22} /></Link>

            {/* DYNAMIC LOGIN / LOGOUT TOGGLE */}
            {user ? (
              <button onClick={handleLogout} className="hover:text-[#590202]"><LogOut size={22} /></button>
            ) : (
              <Link href="/auth" className="hover:text-[#590202]"><User size={22} /></Link>
            )}
          </div>
        </div>

        {/* TIER 2: QUICK SCROLL NAV (NO HAMBURGER) */}
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