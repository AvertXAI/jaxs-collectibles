'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react'
import ProductCard from '@/components/product-card'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAll() {
            const { data } = await supabase.from('products').select('*')
            if (data) {
                setProducts(data)
                setFiltered(data)
            }
            setLoading(false)
        }
        fetchAll()
    }, [])

    // SEARCH LOGIC: Filters as you type
    useEffect(() => {
        const results = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFiltered(results)
    }, [searchTerm, products])

    return (
        <main className="min-h-screen bg-[#F2EFDF] pb-24">
            {/* SEARCH HEADER */}
            <section className="bg-white border-b border-[#D9B36C]/20 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#1B263B] mb-8 uppercase">
                        Search the <span className="text-[#590202]">Vault</span>
                    </h1>

                    <div className="relative group">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search by name, category, or era..."
                            className="w-full bg-[#F2EFDF]/50 border-2 border-[#D9B36C]/20 rounded-2xl py-6 px-8 text-xl font-medium outline-none focus:border-[#590202] focus:bg-white transition-all shadow-inner"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D9B36C]" size={28} />
                    </div>

                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C]">
                        Showing {filtered.length} of {products.length} Authenticated Assets
                    </p>
                </div>
            </section>

            {/* RESULTS GRID */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center py-20 opacity-50">
                        <div className="w-10 h-10 border-4 border-[#590202] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Scanning the Database...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-[#D9B36C]/20">
                        <PackageSearch size={48} className="mx-auto text-[#D9B36C] mb-4" />
                        <h2 className="text-2xl font-black text-[#1B263B]">No Items Found</h2>
                        <p className="text-[#1B263B]/60 font-medium">Try searching for "Cards", "Comics", or "Dragon".</p>
                    </div>
                )}
            </section>
        </main>
    )
}