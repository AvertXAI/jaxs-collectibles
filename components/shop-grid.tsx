'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import ProductCard from './product-card' // We will create this next

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ShopGrid() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true })

            if (error) {
                console.error("Error fetching vault:", error)
            } else {
                setProducts(data || [])
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-[#590202] animate-pulse">
                <div className="w-12 h-12 border-4 border-[#D9B36C] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black uppercase tracking-widest text-xs">Unlocking the Vault...</p>
            </div>
        )
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#D9B36C]/30 pb-8">
                <div>
                    <h2 className="text-5xl font-black text-[#1B263B] uppercase tracking-tighter leading-none mb-2">
                        The Collection
                    </h2>
                    <p className="text-[#590202] font-medium italic opacity-80">
                        {products.length} Authenticated Rarities Discovered
                    </p>
                </div>

                {/* Simple Filter Placeholder for later */}
                <div className="mt-6 md:mt-0 text-[10px] font-black uppercase tracking-widest text-[#D9B36C] border border-[#D9B36C] px-4 py-2 rounded-full cursor-pointer hover:bg-[#D9B36C] hover:text-white transition-all">
                    Filter by Category
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}