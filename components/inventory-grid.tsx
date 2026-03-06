'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// Supabase Init (Kept as requested)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function InventoryGrid() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            try {
                // Fetching from Sanity as in your original code
                const data = await client.fetch(
                    groq`*[_type == "product"] | order(_createdAt desc) {
                        _id,
                        name,
                        "slug": slug.current,
                        price,
                        "imageUrl": images[0].asset->url,
                        category,
                        coa
                    }`
                );
                setProducts(data);
            } catch (error) {
                console.error("Sanity fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])

    if (loading) {
        return <div className="p-20 text-center font-black animate-pulse text-[#1B263B]">SCANNING THE VAULT...</div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products.map((product: any) => (
                <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all relative"
                >
                    {/* VERIFIED BADGE - Shows if coa.verified is true in Sanity */}
                    {product.coa?.verified && (
                        <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md border border-emerald-500/50 p-1 rounded-md flex items-center gap-1">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Verified</span>
                        </div>
                    )}

                    <div className="aspect-square relative overflow-hidden bg-zinc-800">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-xs">No Image</div>
                        )}
                    </div>

                    <div className="p-3">
                        <h3 className="text-sm font-medium text-zinc-100 truncate">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">{product.category}</span>
                            <span className="text-sm font-bold text-green-400">${product.price}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}