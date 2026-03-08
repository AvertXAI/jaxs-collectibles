//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Edit2, Trash2, ExternalLink, ShieldCheck, ArrowLeft, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'
import EditProductModal from '@/components/admin/edit-product-modal'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminShopManager() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const router = useRouter();

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("Vault retrieval error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])

    async function handleDelete(id: string, name: string) {
        const confirmed = window.confirm(`Are you sure you want to purge "${name}" from the Vault? This cannot be undone.`);
        if (confirmed) {
            try {
                // THE FIX: Ensuring the URL strictly uses the Supabase 'id'
                const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setProducts(products.filter(p => p.id !== id));
                    alert("Asset purged successfully.");
                } else {
                    alert("Failed to purge asset. Check console.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    }

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-[#590202]">SCANNING THE VAULT...</div>

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Inventory Control</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Managing {products.length} Assets in the Vault</p>
                </div>

                <div className="flex gap-4">
                    <Link href="/admin/dashboard" title="Return to Dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    <button
                        onClick={() => router.push('/under-construction')}
                        title="Add a new physical asset to the database"
                        className="bg-[#590202] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1B263B] transition-all flex items-center gap-2 shadow-lg"
                    >
                        <PlusCircle size={14} /> Add New Product
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-[#D9B36C]/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1B263B] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6">Asset Image</th>
                            <th className="p-6">Product Details</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Price</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#1B263B]">
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-[#D9B36C]/10 hover:bg-[#F2EFDF]/30 transition-colors group">
                                <td className="p-4">
                                    <div className="w-16 h-16 bg-[#F2EFDF] rounded-xl overflow-hidden relative border border-[#D9B36C]/20">
                                        {(product.images?.[0] || product.image_url) && (
                                            <NextImage src={product.images?.[0] || product.image_url} alt={product.name} fill sizes="64px" className="object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black uppercase">{product.name}</span>
                                            {product.coa?.verified && <ShieldCheck size={14} className="text-emerald-600" />}
                                        </div>
                                        <span className="text-[9px] text-[#1B263B]/40 uppercase tracking-tighter font-black">ID: {product.id.slice(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="p-6 uppercase text-[#D9B36C] tracking-widest text-[10px]">{product.category || 'General'}</td>
                                <td className="p-6 font-black text-[#590202]">${product.price}</td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/shop/${product.slug}`} target="_blank" title="View Live Product Page" className="p-2 bg-[#F2EFDF] rounded-lg hover:bg-[#590202] hover:text-white transition-all">
                                            <ExternalLink size={16} />
                                        </Link>
                                        <button onClick={() => setEditingProduct(product)} title="Edit Asset Details" className="p-2 bg-[#F2EFDF] text-[#1B263B] rounded-lg hover:bg-[#D9B36C] hover:text-black transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id, product.name)} title="Purge Asset from Database" className="p-2 bg-[#F2EFDF] text-[#590202] rounded-lg hover:bg-[#590202] hover:text-white transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    // THE FIX: Ensuring 'updated' matches Supabase schema 'id'
                    onUpdate={(updated) => setProducts(products.map(p => p.id === updated.id ? updated : p))}
                />
            )}
        </main>
    )
}