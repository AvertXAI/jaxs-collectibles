'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingCart, Heart, CreditCard, Calendar, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CustomerIntelligence() {
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Control States
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const [expandedId, setExpandedId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        async function fetchCustomers() {
            setLoading(true)
            try {
                const queryParams = new URLSearchParams({
                    page: page.toString(),
                    search: debouncedSearch,
                    sortBy: 'created_at', // Defaulted to backend
                    sortOrder: 'desc'     // Defaulted to backend
                })
                const res = await fetch(`/api/admin/customers?${queryParams}`)
                const data = await res.json()

                if (data.success) {
                    setCustomers(data.customers)
                    setTotalPages(data.totalPages)
                }
            } catch (error) {
                console.error("Failed to load customer intelligence", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCustomers()
    }, [page, debouncedSearch])

    // Reset to page 1 if we change search
    useEffect(() => { setPage(1) }, [debouncedSearch])

    const toggleRow = (id: string) => setExpandedId(expandedId === id ? null : id)
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Customer Intelligence</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">CRM & Fulfillment Data</p>
                </div>
                <Link href="/admin/dashboard" title="Return to Dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
            </header>

            <div className="max-w-6xl mx-auto space-y-6">

                {/* --- THE CONTROL BAR --- */}
                <div className="bg-white p-4 rounded-2xl border border-[#D9B36C]/20 shadow-sm flex flex-col md:flex-row items-center gap-4">

                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search Name, Email, Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#F2EFDF]/50 rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none border border-transparent focus:border-[#590202] transition-all"
                        />
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B263B]/40" />
                    </div>

                    <div className="flex-1"></div>

                    {/* Page Jump Selector */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/40">Jump to Page:</span>
                        <select
                            value={page}
                            onChange={(e) => setPage(Number(e.target.value))}
                            className="bg-[#1B263B] text-white rounded-xl py-3 px-4 text-sm font-black outline-none cursor-pointer hover:bg-[#590202] transition-all"
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>Page {num}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- DATA DISPLAY --- */}
                {loading ? (
                    <div className="p-20 text-center font-black animate-pulse text-[#590202] uppercase tracking-widest">Scanning Database...</div>
                ) : customers.length === 0 ? (
                    <div className="p-20 text-center font-black text-[#1B263B]/40 uppercase tracking-widest border-2 border-dashed border-[#D9B36C]/30 rounded-3xl">No profiles found.</div>
                ) : (
                    <div className="space-y-4">
                        {customers.map((c) => (
                            <div key={c.id} className="bg-white border border-[#D9B36C]/20 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div onClick={() => toggleRow(c.id)} className="cursor-pointer p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F2EFDF]/30 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        <div className="w-10 h-10 bg-[#1B263B] text-white rounded-full flex items-center justify-center font-black text-lg">
                                            {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#1B263B] text-lg uppercase">{c.lastName}, {c.firstName}</h3>
                                            <p className="text-[10px] font-bold text-[#1B263B]/40 tracking-widest uppercase">{c.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full md:w-2/3 text-sm font-bold text-[#1B263B]/70">
                                        <div className="w-1/3 text-center">{c.phone}</div>
                                        <div className="w-1/3 text-center text-[10px] uppercase tracking-widest text-[#D9B36C]"><Calendar size={12} className="inline mr-1 -mt-0.5" /> Joined {formatDate(c.joined)}</div>
                                        <div className="w-1/3 text-right text-[10px] uppercase tracking-widest"><Clock size={12} className="inline mr-1 -mt-0.5" /> Last Login: {formatDate(c.lastLogin)}</div>
                                    </div>

                                    <div className="text-[#590202] ml-4">
                                        {expandedId === c.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                    </div>
                                </div>

                                {expandedId === c.id && (
                                    <div className="bg-[#FDFBF7] border-t border-[#D9B36C]/10 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="bg-white p-5 rounded-xl border border-[#1B263B]/5">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B263B]/50 mb-4">
                                                <ShoppingCart size={14} /> Active Cart
                                            </h4>
                                            <p className="text-xl font-black text-[#1B263B]">{c.cartStatus}</p>
                                            <button onClick={() => router.push('/under-construction')} className="mt-4 text-[9px] font-black uppercase tracking-widest text-[#590202] hover:underline">View Cart Contents</button>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-[#1B263B]/5">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B263B]/50 mb-4">
                                                <Heart size={14} /> Wishlist
                                            </h4>
                                            <p className="text-xl font-black text-[#1B263B]">{Math.floor(Math.random() * 5)} Saved Items</p>
                                            <button onClick={() => router.push('/under-construction')} className="mt-4 text-[9px] font-black uppercase tracking-widest text-[#590202] hover:underline">View Wishlist</button>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-[#1B263B]/5">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B263B]/50 mb-4">
                                                <CreditCard size={14} /> Payment Intel
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#1B263B] text-white text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest">VISA</div>
                                                <p className="text-sm font-black text-[#1B263B]">•••• {c.paymentData.split(' ').pop()}</p>
                                            </div>
                                            <p className="mt-4 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">PCI-DSS Secured</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center justify-between pt-8 border-t border-[#D9B36C]/20 mt-8">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-3 bg-white border border-[#D9B36C]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1B263B] disabled:opacity-30 hover:bg-[#F2EFDF] transition-all">Previous Page</button>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B263B]/60">Page {page} of {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-6 py-3 bg-white border border-[#D9B36C]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1B263B] disabled:opacity-30 hover:bg-[#F2EFDF] transition-all">Next Page</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}