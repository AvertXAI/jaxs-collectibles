//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchTaxRate } from '@/brain/cart/taxMechanic'
import { getUserAddresses, addAddress } from '@/brain/users/addressMechanic'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC',
  'ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart()
    const [mounted, setMounted] = useState(false)

    // --- GATEWAY STATES ---
    const [addresses, setAddresses] = useState<any[]>([])
    const [isNewAddress, setIsNewAddress] = useState(false)
    const [shippingLocked, setShippingLocked] = useState(false)

    // --- TAX & SHIPPING STATES ---
    const [activeStateCode, setActiveStateCode] = useState('TX')
    const [taxRate, setTaxRate] = useState(0)
    const [isCalculating, setIsCalculating] = useState(false)

    // Placeholder for Phase 29: Admin Shipping Controls
    const shippingCost = 25.00;

    // --- FORM STATES ---
    const [formData, setFormData] = useState({
        full_name: '',
        street_address: '',
        city: '',
        state_code: 'TX',
        postal_code: ''
    })

    useEffect(() => {
        setMounted(true)
        const loadProfiles = async () => {
            try {
                const savedAddresses = await getUserAddresses()
                setAddresses(savedAddresses)
                if (savedAddresses.length > 0) {
                    const defaultAddr = savedAddresses.find((a: any) => a.is_default) || savedAddresses[0]
                    setActiveStateCode(defaultAddr.state_code)
                } else {
                    setIsNewAddress(true)
                }
            } catch (error) {
                setIsNewAddress(true)
            }
        }
        loadProfiles()
    }, [])

    useEffect(() => {
        const getRate = async () => {
            setIsCalculating(true)
            try {
                const rate = await fetchTaxRate(activeStateCode)
                setTaxRate(rate)
            } catch (error) {
                setTaxRate(0)
            } finally {
                setIsCalculating(false)
            }
        }
        getRate()
    }, [activeStateCode])

    const handleConfirmShipping = async () => {
        if (isNewAddress) {
            if (!formData.full_name || !formData.street_address || !formData.city || !formData.postal_code) {
                alert("Vault Security: Incomplete shipping destination. All fields required.")
                return
            }
            try {
                await addAddress({ ...formData, is_default: true })
            } catch (e) {
                console.log("Guest session: Proceeding without saving address to profile.")
            }
        }
        setShippingLocked(true)
    }

    if (!mounted) return null

    // --- DYNAMIC ORDER MATH ---
    const taxAmount = cartTotal * taxRate;
    const finalTotal = cartTotal + shippingCost + taxAmount;

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-white text-black font-sans">

            {/* LEFT COLUMN: ORDER SUMMARY */}
            <div className="w-full lg:w-1/2 bg-[#f4f4f5] lg:min-h-screen p-8 lg:p-16 flex flex-col items-center lg:items-end border-r border-gray-200">
                <div className="w-full max-w-md pt-8 lg:pt-12">
                    <Link href="/cart" className="flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-8 font-medium">
                        <ArrowLeft size={16} className="mr-2" /> Return to Cart
                    </Link>

                    <p className="text-gray-500 mb-2 font-medium">Pay Jax's Collectibles</p>
                    <h1 className="text-5xl font-semibold mb-8 text-black tracking-tight flex items-center gap-4">
                        ${finalTotal.toFixed(2)}
                        {isCalculating && <span className="w-5 h-5 border-2 border-[#590202] border-t-transparent rounded-full animate-spin"></span>}
                    </h1>

                    {/* Cart Items */}
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
                            <span>Secure Vault Transport</span>
                            <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-2">
                                State Tax ({activeStateCode})
                                <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">{(taxRate * 100).toFixed(2)}%</span>
                            </span>
                            <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold text-black pt-4 border-t border-gray-200">
                            <span>Total due</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: GATEWAY */}
            <div className="w-full lg:w-1/2 bg-white lg:min-h-screen p-8 lg:p-16 flex flex-col items-center lg:items-start">
                <div className="w-full max-w-md pt-8 lg:pt-12 space-y-10">

                    {!shippingLocked && (
                        <div className="animate-in fade-in duration-500">
                            <button className="w-full bg-[#00D66F] hover:bg-[#00c264] text-white py-3 rounded-md font-bold mb-6 transition-colors flex justify-center items-center gap-2 shadow-sm">
                                Pay with <span className="font-black tracking-tighter">link</span>
                            </button>
                            <div className="flex items-center text-sm text-gray-400 mb-6">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="px-3 font-medium">Or manually confirm details</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: DESTINATION SOURCING */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h2 className="text-lg font-black uppercase text-[#1B263B] flex items-center gap-2">
                                <Truck size={18} className={shippingLocked ? "text-emerald-600" : "text-[#590202]"} />
                                1. Shipping Destination
                            </h2>
                            {shippingLocked && (
                                <button onClick={() => setShippingLocked(false)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                            )}
                        </div>

                        {shippingLocked ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3 animate-in zoom-in-95 duration-300">
                                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{isNewAddress ? formData.full_name : addresses[0]?.full_name}</p>
                                    <p className="text-sm text-gray-600">{isNewAddress ? formData.street_address : addresses[0]?.street_address}</p>
                                    <p className="text-sm text-gray-600">{isNewAddress ? `${formData.city}, ${formData.state_code} ${formData.postal_code}` : `${addresses[0]?.city}, ${addresses[0]?.state_code} ${addresses[0]?.postal_code}`}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                {addresses.length > 0 && !isNewAddress && (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <label key={addr.id} className="flex items-start gap-3 p-4 border border-blue-500 bg-blue-50/30 rounded-lg cursor-pointer relative overflow-hidden">
                                                <input type="radio" name="address" defaultChecked className="mt-1 w-4 h-4 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                        {addr.full_name}
                                                        {addr.is_default && <span className="bg-blue-100 text-blue-800 text-[9px] uppercase font-black px-2 py-0.5 rounded">Default</span>}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{addr.street_address}</p>
                                                    <p className="text-sm text-gray-600">{addr.city}, {addr.state_code} {addr.postal_code}</p>
                                                </div>
                                            </label>
                                        ))}
                                        <button onClick={() => setIsNewAddress(true)} className="text-sm font-bold text-blue-600 hover:text-blue-800 mt-2 block">+ Enter a different address</button>
                                    </div>
                                )}

                                {(addresses.length === 0 || isNewAddress) && (
                                    <div className="space-y-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                        <input type="text" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                        <input type="text" placeholder="Street Address" value={formData.street_address} onChange={(e) => setFormData({ ...formData, street_address: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-1/2 border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />

                                            {/* THE FIX: ALL 50 STATES MAPPED FROM SEEDER DATA */}
                                            <select
                                                value={formData.state_code}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, state_code: e.target.value })
                                                    setActiveStateCode(e.target.value)
                                                }}
                                                className="w-1/4 border border-gray-300 rounded-md px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                            >
                                                {US_STATES.map((code) => (
                                                    <option key={code} value={code}>{code}</option>
                                                ))}
                                            </select>

                                            <input type="text" placeholder="ZIP" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} className="w-1/4 border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                        </div>
                                        {addresses.length > 0 && (
                                            <button onClick={() => setIsNewAddress(false)} className="text-xs font-bold text-gray-500 hover:text-black">Cancel</button>
                                        )}
                                    </div>
                                )}

                                <button onClick={handleConfirmShipping} className="w-full bg-[#1B263B] hover:bg-[#590202] text-white py-3.5 rounded-md font-bold uppercase tracking-widest text-xs transition-all shadow-md">
                                    Confirm Destination
                                </button>
                            </div>
                        )}
                    </div>

                    {/* STEP 2: PAYMENT GATEWAY (LOCKED UNTIL SHIPPING IS CONFIRMED) */}
                    <div className="space-y-4 relative">
                        <h2 className={`text-lg font-black uppercase flex items-center gap-2 border-b border-gray-200 pb-2 transition-colors ${shippingLocked ? 'text-[#1B263B]' : 'text-gray-300'}`}>
                            <Lock size={18} /> 2. Secure Payment
                        </h2>

                        {!shippingLocked && (
                            <div className="absolute inset-0 top-10 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
                                <Lock size={32} className="text-gray-300 mb-2" />
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center px-6">Confirm shipping destination<br />to unlock payment gateway</p>
                            </div>
                        )}

                        <div className={`space-y-4 transition-opacity duration-500 ${!shippingLocked ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
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

                            <div className="pt-4">
                                <button className="w-full bg-[#0074D4] hover:bg-[#0060b0] text-white py-4 rounded-md font-semibold transition-all flex justify-center items-center gap-2 shadow-lg text-lg transform active:scale-[0.98]">
                                    <Lock size={18} /> Pay ${finalTotal.toFixed(2)}
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 select-none">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[7px] font-black uppercase tracking-widest text-[#1a1f71] mb-0.5">Verified by</span>
                                        <span className="text-xl font-black italic text-[#1a1f71] leading-none">VISA</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex -space-x-1.5 mb-1">
                                            <div className="w-4 h-4 rounded-full bg-[#eb001b] mix-blend-multiply"></div>
                                            <div className="w-4 h-4 rounded-full bg-[#f79e1b] mix-blend-multiply"></div>
                                        </div>
                                        <span className="text-[7px] font-black text-gray-800 uppercase tracking-widest leading-none">Identity Check&trade;</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200"></div>
                                    <div className="flex flex-col items-center text-gray-800">
                                        <ShieldCheck size={20} className="text-emerald-600 mb-0.5" />
                                        <span className="text-[7px] font-black uppercase tracking-widest leading-none">PCI-DSS Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}