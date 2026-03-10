//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: components/global/cart-sidebar.tsx
//////////////////////////////////////////////////
'use client'

import { useCart, CartItem } from '../../context/CartContext'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar() {
    const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart()

    if (!isCartOpen) return null

    return (
        <div className="fixed inset-0 z-[10001] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#1B263B]/60 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />

            {/* Sidebar Pane */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* THE FIX: White text over Blue background */}
                <header className="p-8 border-b border-[#D9B36C]/20 flex justify-between items-center bg-[#1B263B]">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#D9B36C]/10 p-2 rounded-lg">
                            <ShoppingBag size={20} className="text-[#D9B36C]" />
                        </div>
                        <h2 className="font-black uppercase tracking-[0.2em] text-sm text-admin-gold m-0 p-0 leading-none">
                            Active Acquisition
                        </h2>
                    </div>
                    <button onClick={() => setCartOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full text-white hover:bg-[#D9B36C] hover:text-[#1B263B]">
                        <X size={20} strokeWidth={3} />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-8 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <div className="w-24 h-24 bg-[#F2EFDF] rounded-full flex items-center justify-center">
                                <ShoppingBag size={40} className="text-[#1B263B]" />
                            </div>
                            <p className="font-black uppercase tracking-widest text-xs text-[#1B263B]">The Vault is Empty</p>
                        </div>
                    ) : (
                        cart.map((item: CartItem) => (
                            <div key={item.id} className="flex gap-6 bg-[#F2EFDF]/30 p-5 rounded-3xl border border-[#D9B36C]/10 group transition-all hover:bg-white hover:shadow-lg">
                                <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 relative p-3 border border-[#D9B36C]/10">
                                    <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-black text-[#1B263B] text-[10px] uppercase leading-tight mb-2 line-clamp-2">{item.name}</h4>
                                        <p className="text-[#590202] font-black text-sm">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D9B36C]/5">
                                        <div className="flex items-center border border-[#D9B36C]/30 rounded-xl overflow-hidden bg-white shadow-sm">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-xs hover:bg-[#F2EFDF] font-black text-[#1B263B]">-</button>
                                            <span className="px-4 py-1 text-[10px] font-black bg-[#F2EFDF]/20 text-[#1B263B]">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-xs hover:bg-[#F2EFDF] font-black text-[#1B263B]">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[#590202]/30 hover:text-[#590202] transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <footer className="p-8 border-t border-[#D9B36C]/20 bg-[#F2EFDF]/50 space-y-6 rounded-t-[3rem]">
                        <div className="space-y-3 px-2">
                            <div className="flex justify-between text-[10px] font-bold text-[#1B263B]/60 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-[#590202] uppercase tracking-widest">
                                <span>Vault Fee (5%)</span>
                                <span>${(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-[#1B263B] uppercase tracking-tighter pt-4 border-t border-[#D9B36C]/20">
                                <span>Total</span>
                                <span>${(cartTotal * 1.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href="/cart" onClick={() => setCartOpen(false)} className="w-full bg-[#1B263B] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#590202] transition-all shadow-xl hover:-translate-y-1">
                            Go To Checkout
                        </Link>
                    </footer>
                )}
            </div>
        </div>
    )
}