//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/shop/[slug]/page.tsx
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, ShoppingCart, Heart, Star, Truck, RotateCcw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useSupabase } from '@/components/supabase-provider'

export default function AssetCloserPage() {
    const { slug } = useParams()
    const { addToCart } = useCart()
    const supabase = useSupabase()

    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeImg, setActiveImg] = useState(0)

    useEffect(() => {
        async function fetchAsset() {
            setLoading(true)
            try {
                const rawSlug = Array.isArray(slug) ? slug[0] : slug;
                const slugStr = decodeURIComponent(rawSlug || '');

                // ====================================================
                // ⚠️ PRESENTATION DEMO OVERRIDE ⚠️
                // ====================================================
                if (slugStr.startsWith('demo-')) {
                    let demoProduct = {
                        id: slugStr,
                        slug: slugStr,
                        name: "Vault Classified Asset",
                        price: 999.99,
                        category: "Exclusive",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        images: ["/logo.png"],
                        stock: 1
                    };

                    if (slugStr === 'demo-guitar') {
                        demoProduct.name = "1960s Vintage Sunburst Guitar";
                        demoProduct.price = 12500.00;
                        demoProduct.category = "Instruments";
                        demoProduct.images = ["/4-2.jpg"];
                    } else if (slugStr === 'demo-batman') {
                        demoProduct.name = "First Edition Batman Mini-Figure";
                        demoProduct.price = 450.00;
                        demoProduct.category = "Statues & Figures";
                        demoProduct.images = ["/4-3.jpg"];
                    } else if (slugStr === 'demo-cards') {
                        demoProduct.name = "Graded TCG Rare Collection";
                        demoProduct.price = 3200.00;
                        demoProduct.category = "TCG / Cards";
                        demoProduct.images = ["/4-4.jpg"];
                    } else if (slugStr === 'demo-comics') {
                        demoProduct.name = "Silver Surfer #1 (Pristine Grade)";
                        demoProduct.price = 8500.00;
                        demoProduct.category = "First Edition Comics";
                        demoProduct.images = ["/4-1.jpg"];
                    }

                    setProduct(demoProduct);
                    setLoading(false);
                    return;
                }

                // ====================================================
                // NORMAL DATABASE BEHAVIOR (CRASH-PROOFED)
                // Added .limit(1) to EVERYTHING so Postgres never panics
                // ====================================================

                // 1. Try exact Slug
                let { data } = await supabase.from('products').select('*').eq('slug', slugStr).limit(1).maybeSingle()

                // 2. Try exact ID (Checks if it's a UUID or an Integer ID)
                if (!data) {
                    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slugStr);
                    const isNumericId = /^\d+$/.test(slugStr);

                    if (isUUID || isNumericId) {
                        const { data: idData } = await supabase.from('products').select('*').eq('id', slugStr).limit(1).maybeSingle()
                        data = idData
                    }
                }

                // 3. Try exact Name match (Some items use Name as the Slug)
                if (!data) {
                    const cleanName = slugStr.replace(/-/g, ' ');
                    const { data: nameData } = await supabase.from('products').select('*').ilike('name', cleanName).limit(1).maybeSingle()
                    data = nameData;
                }

                // 4. Fuzzy Search Fallback (Takes first word, limits to 1 result to prevent crash)
                if (!data) {
                    const fuzzyName = slugStr.replace(/-/g, ' ').split(' ')[0];
                    if (fuzzyName) {
                        const { data: fuzzyData } = await supabase.from('products').select('*').ilike('name', `%${fuzzyName}%`).limit(1).maybeSingle()
                        data = fuzzyData;
                    }
                }

                setProduct(data || null);
            } catch (err) {
                console.error("Vault Decryption Error:", err)
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }
        if (slug && supabase) fetchAsset()
    }, [slug, supabase])

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-[#590202] uppercase tracking-[0.5em]">Syncing Asset Intel...</div>
    if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20"><ShieldCheck size={48} className="text-[#1B263B]/20" /><div className="font-black uppercase tracking-widest text-[#1B263B]">Asset Purged or Classified.</div><Link href="/shop" className="text-[10px] text-[#590202] uppercase font-bold hover:underline">Return to Ledger</Link></div>

    let allImages: string[] = ['/logo.png'];
    if (Array.isArray(product.images) && product.images.length > 0) {
        allImages = product.images;
    } else if (typeof product.images === 'string') {
        try { allImages = JSON.parse(product.images); } catch (e) { allImages = [product.images]; }
    } else if (product.image_url) {
        allImages = [product.image_url];
    }

    const availableStock = product.stock || 0;

    const handleAcquisition = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: allImages[0],
            stock: availableStock,
            slug: product.slug || product.id
        })
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
            <div className="container mx-auto px-8 max-w-7xl">

                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B263B]/40 mb-12">
                    <Link href="/" className="hover:text-[#590202]">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#590202]">Shop</Link>
                    <span>/</span>
                    <span className="text-[#1B263B]">{product.category || 'General'}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white border border-[#D9B36C]/20 rounded-3xl overflow-hidden relative aspect-square flex items-center justify-center p-12 shadow-sm">
                            <Image
                                src={allImages[activeImg]}
                                alt={product.name}
                                fill
                                className="object-contain p-12 mix-blend-multiply"
                                priority
                            />
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {allImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`w-24 h-24 flex-shrink-0 rounded-xl border-2 transition-all overflow-hidden bg-white p-2 ${activeImg === idx ? 'border-[#590202] shadow-md' : 'border-[#D9B36C]/20 opacity-60 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt="Thumbnail" width={100} height={100} className="object-contain w-full h-full mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black italic text-[#1B263B] uppercase tracking-tighter mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex text-[#D9B36C]">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/40">(Verified Inspection)</span>
                            </div>

                            <div className="flex items-end gap-4 mb-8">
                                <span className="text-4xl font-black text-[#590202]">${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className="text-xl font-bold text-[#1B263B]/30 line-through mb-1">${(Number(product.price) * 1.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                                <ShieldCheck size={14} /> In Vault & Verified
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-[#D9B36C]/20 shadow-sm space-y-6">

                            {availableStock === 1 ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-[#D9B36C]/10 pb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#590202]">Scarcity Protocol</span>
                                            <span className="text-xl font-black text-[#1B263B] uppercase mt-1">Unique 1-of-1 Asset</span>
                                        </div>
                                        <div className="bg-[#590202]/5 px-4 py-2 rounded-xl border border-[#590202]/10">
                                            <span className="text-[10px] font-black text-[#590202] uppercase tracking-widest text-center block">Vault Exclusive</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#1B263B]">Acquisition Price</span>
                                        <span className="text-2xl font-black text-[#1B263B]">${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <button
                                        onClick={handleAcquisition}
                                        className="w-full bg-[#590202] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#1B263B] transition-all flex items-center justify-center gap-4 group"
                                    >
                                        <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                                        Buy Asset Now
                                    </button>
                                </div>
                            ) : availableStock > 1 ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-[#D9B36C]/10 pb-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest text-[#1B263B]">Quantity</span>
                                            <span className="text-[9px] font-bold uppercase text-[#590202]/60 mt-1">
                                                {availableStock} Left in Vault
                                            </span>
                                        </div>

                                        <div className="flex items-center border border-[#D9B36C]/30 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 hover:bg-[#F2EFDF] font-black text-[#1B263B] transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="px-6 py-2 font-black text-[#1B263B] border-x border-[#D9B36C]/30 min-w-[50px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                                                disabled={quantity >= availableStock}
                                                className={`px-4 py-2 font-black transition-colors ${quantity >= availableStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[#F2EFDF] text-[#1B263B]'}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#1B263B]">Subtotal</span>
                                        <span className="text-2xl font-black text-[#1B263B]">${(Number(product.price) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <button
                                        onClick={handleAcquisition}
                                        className="w-full bg-[#1B263B] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-[#590202] transition-all flex items-center justify-center gap-3 shadow-lg group"
                                    >
                                        <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" /> Add Asset to Cart
                                    </button>
                                </>
                            ) : (
                                <div className="bg-[#F2EFDF] text-[#590202] py-6 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-[#590202]/20 opacity-70">
                                    <AlertTriangle size={18} /> Asset Depleted
                                </div>
                            )}

                            {availableStock > 0 && (
                                <button className="w-full p-4 border border-[#D9B36C]/30 rounded-xl hover:bg-[#F2EFDF] text-[#1B263B] transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    <Heart size={16} /> Save to Intelligence Watchlist
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-[#F2EFDF]/50 rounded-2xl border border-[#D9B36C]/10">
                                <Truck className="text-[#590202]" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]">Secured Transport</p>
                                    <p className="text-[9px] font-bold text-[#1B263B]/50 uppercase">Insured delivery via private courier.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-[#F2EFDF]/50 rounded-2xl border border-[#D9B36C]/10">
                                <RotateCcw className="text-[#590202]" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]">Return Protocol</p>
                                    <p className="text-[9px] font-bold text-[#1B263B]/50 uppercase">30-day vault return policy. Terms apply.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 border-t border-[#D9B36C]/20 pt-12">
                    <div className="flex gap-12 mb-12 border-b border-[#D9B36C]/10 overflow-x-auto no-scrollbar">
                        {['Description', 'Additional Intelligence', 'Verified Reviews'].map((tab, i) => (
                            <button key={tab} className={`pb-4 text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${i === 0 ? 'text-[#590202] border-b-2 border-[#590202]' : 'text-[#1B263B]/40 hover:text-[#1B263B]'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="max-w-4xl space-y-6">
                        <p className="text-[#1B263B]/70 font-bold leading-relaxed">
                            {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
                        </p>
                    </div>
                </div>

            </div>
        </main>
    )
}