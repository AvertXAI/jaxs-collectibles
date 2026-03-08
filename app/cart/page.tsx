//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, ArrowLeft, Trash2, MapPin, Plus, Ticket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function RetailCartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

    // THE RESET PROTOCOL: confirm dialog before wipe
    const handleReset = () => {
        if (confirm("Are you sure to reset your Cart?")) {
            clearCart();
        }
    }

    // EMPTY STATE
    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 text-center pt-40">
                <div className="bg-white p-16 rounded-[3rem] shadow-2xl border border-[#D9B36C]/20 max-w-lg animate-in zoom-in duration-300">
                    <div className="w-32 h-32 bg-[#F2EFDF] rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={56} className="text-[#1B263B] opacity-20" />
                    </div>
                    <h1 className="text-3xl font-black text-[#1B263B] uppercase mb-4 tracking-tighter">Your cart is feeling lonely</h1>
                    <p className="text-sm font-bold text-[#1B263B]/50 uppercase mb-10 leading-relaxed">
                        Looks like you haven't added anything to your cart yet. Let's change that and find some amazing collectibles for you!
                    </p>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-[#1B263B] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#590202] transition-all shadow-xl">
                        Discover Products <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] pt-40 pb-24">
            <div className="container mx-auto px-8 max-w-7xl">
                <div className="flex items-center justify-between mb-12 border-b border-[#D9B36C]/20 pb-8">
                    <h1 className="text-4xl font-black italic text-[#1B263B] uppercase tracking-tighter flex items-center gap-4">
                        <ShoppingBag size={32} className="text-[#590202]" /> Shopping Cart
                    </h1>
                    <button onClick={handleReset} className="bg-red-50 text-[#590202] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] hover:text-white transition-all border border-red-100">
                        Reset Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: PRODUCT LIST */}
                    <div className="lg:col-span-8 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white border border-[#D9B36C]/10 rounded-3xl p-6 flex gap-8 items-center shadow-sm">
                                <div className="w-32 h-32 bg-[#F2EFDF]/30 rounded-2xl flex-shrink-0 relative p-4 border border-[#D9B36C]/10">
                                    <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-black text-[#1B263B] text-sm uppercase tracking-tight max-w-md">{item.name}</h3>
                                        <span className="font-black text-[#1B263B] text-lg">${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-[#D9B36C]/20 rounded-xl overflow-hidden shadow-inner">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 hover:bg-[#F2EFDF] font-black">-</button>
                                            <span className="px-6 py-2 text-xs font-black bg-[#F2EFDF]/20">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 hover:bg-[#F2EFDF] font-black">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-[#590202]/30 hover:text-[#590202] transition-colors p-2">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl border border-[#D9B36C]/20 shadow-xl overflow-hidden">
                            <header className="bg-[#1B263B] p-6 text-white text-center">
                                <h2 className="font-black uppercase tracking-widest text-xs text-admin-gold">Order Summary</h2>
                            </header>
                            <div className="p-8 space-y-4">
                                <div className="flex justify-between text-xs font-bold text-[#1B263B]/60 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-[#1B263B]">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    <span>Discount</span>
                                    <span>-$0.00</span>
                                </div>
                                <div className="pt-4 border-t border-[#D9B36C]/10">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#1B263B]/40 mb-3">Coupon Code</p>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="ENTER CODE" className="flex-grow bg-[#F2EFDF]/50 border border-[#D9B36C]/20 rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-[#590202]" />
                                        <button className="bg-[#1B263B] text-white px-4 rounded-xl font-black text-[9px] uppercase"><Ticket size={14} /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-black text-[#1B263B] uppercase tracking-tighter pt-6 border-t border-[#D9B36C]/20">
                                    <span>Total</span>
                                    <span className="text-[#590202]">${(cartTotal).toFixed(2)}</span>
                                </div>
                                <button className="w-full bg-[#1B263B] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#590202] transition-all mt-4">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>

                        {/* DELIVERY ADDRESS BLOCK */}
                        <div className="bg-white rounded-3xl border border-[#D9B36C]/20 p-8 space-y-6 shadow-md">
                            <h3 className="font-black uppercase tracking-widest text-xs text-[#1B263B] flex items-center gap-2">
                                <MapPin size={16} /> Delivery Address
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 bg-[#F2EFDF]/30 rounded-2xl border-2 border-[#1B263B]">
                                    <div className="w-4 h-4 rounded-full border-4 border-[#1B263B] bg-white flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-[#1B263B]">Home (Default)</p>
                                        <p className="text-[9px] font-bold text-[#1B263B]/60 uppercase">San Antonio, TX Sector 78201</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-4 border-2 border-dashed border-[#D9B36C]/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1B263B]/40 hover:bg-[#F2EFDF] transition-all flex items-center justify-center gap-2">
                                <Plus size={14} /> Add New Address
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}