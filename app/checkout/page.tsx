//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch on the cart total
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // --- PHASE 28: STRICT ORDER MATH ---
    const vaultFee = cartTotal * 0.05;
    const finalTotal = cartTotal + vaultFee;

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-white text-black font-sans">
            {/* LEFT COLUMN: Order Summary */}
            <div className="w-full lg:w-1/2 bg-[#f4f4f5] lg:min-h-screen p-8 lg:p-16 flex flex-col items-center lg:items-end border-r border-gray-200">
                <div className="w-full max-w-md pt-8 lg:pt-12">
                    <Link href="/cart" className="flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-8 font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Return to Cart
                    </Link>

                    <p className="text-gray-500 mb-2 font-medium">Pay Jax's Collectibles</p>
                    <h1 className="text-5xl font-semibold mb-8 text-black tracking-tight">
                        ${finalTotal.toFixed(2)}
                    </h1>

                    {/* Cart Items List */}
                    <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 relative p-1 flex-shrink-0 shadow-sm">
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-sm font-medium text-black line-clamp-2">{item.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Qty {item.quantity}</p>
                                </div>
                                <div className="text-sm font-medium text-black">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300 pt-6 space-y-3">
                        <div className="flex justify-between text-sm text-gray-600 font-medium">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 font-medium">
                            <span>Vault Authentication Fee (5%)</span>
                            <span>${vaultFee.toFixed(2)}</span>
                        </div>
                        <div className="pt-2">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">Add promotion code</a>
                        </div>
                        <div className="flex justify-between text-base font-semibold text-black pt-4 border-t border-gray-200">
                            <span>Total due</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Payment UI */}
            <div className="w-full lg:w-1/2 bg-white lg:min-h-screen p-8 lg:p-16 flex flex-col items-center lg:items-start">
                <div className="w-full max-w-md pt-8 lg:pt-12">

                    {/* Mock Express Checkout Button */}
                    <button className="w-full bg-[#00D66F] hover:bg-[#00c264] text-white py-3 rounded-md font-bold mb-6 transition-colors flex justify-center items-center gap-2 shadow-sm">
                        Pay with <span className="font-black tracking-tighter">link</span>
                    </button>

                    <div className="flex items-center text-sm text-gray-400 mb-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="px-3 font-medium">Or pay with card</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" placeholder="collector@example.com" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card information</label>
                            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                                <input type="text" placeholder="1234 1234 1234 1234" className="w-full px-3 py-2.5 text-sm outline-none border-b border-gray-300" />
                                <div className="flex">
                                    <input type="text" placeholder="MM / YY" className="w-1/2 px-3 py-2.5 text-sm outline-none border-r border-gray-300" />
                                    <input type="text" placeholder="CVC" className="w-1/2 px-3 py-2.5 text-sm outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder name</label>
                            <input type="text" placeholder="Full name on card" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country or region</label>
                            <select className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm">
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>Canada</option>
                                <option>Australia</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-pointer">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Securely save my information for 1-click checkout</p>
                                    <p className="text-xs text-gray-500 mt-1">Pay faster on Jax's Collectibles and everywhere Link is accepted.</p>
                                </div>
                            </label>
                        </div>

                        <div className="pt-4">
                            <button className="w-full bg-[#0074D4] hover:bg-[#0060b0] text-white py-3.5 rounded-md font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm text-base">
                                <Lock size={16} /> Pay ${finalTotal.toFixed(2)}
                            </button>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1">Powered by <span className="font-bold text-gray-500">stripe</span></span>
                        <div className="flex gap-3">
                            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}