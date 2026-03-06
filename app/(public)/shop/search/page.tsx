'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Search, PackageSearch, Ghost } from 'lucide-react'
import ProductCard from '@/components/product-card'

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filtered, setFiltered] = useState<any[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    // Only load products when searching
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchTerm.trim()) return

        setHasSearched(true)
        // Fetch logic here...
    }

    return (
        <main className="min-h-screen bg-[#F2EFDF]">
            <section className="py-20 px-6 text-center">
                <h1 className="text-5xl md:text-8xl font-black italic text-[#1B263B] mb-12">FIND YOUR <span className="text-[#590202]">GRAIL</span></h1>
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Type to unlock the vault..."
                        className="w-full bg-white border-4 border-[#1B263B] rounded-2xl py-6 px-8 text-2xl font-black focus:border-[#590202] transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#590202] text-white p-4 rounded-xl">
                        <Search size={24} />
                    </button>
                </form>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-24">
                {!hasSearched ? (
                    <div className="text-center opacity-20 py-20 flex flex-col items-center">
                        <Ghost size={120} className="mb-4" />
                        <p className="font-black uppercase tracking-[0.5em]">The Vault is Locked. Enter a query to begin scan.</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Results map here */}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <PackageSearch size={64} className="mx-auto text-[#D9B36C] mb-4" />
                        <h2 className="text-2xl font-black">Authentication Failed: No Matches Found</h2>
                    </div>
                )}
            </section>
        </main>
    )
}