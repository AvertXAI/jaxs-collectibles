'use client'
import { useState, useEffect } from 'react'
import { groq } from "next-sanity"
import { client } from "@/sanity/lib/client"
import { Edit2, Trash2, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image' // Renamed to fix JSX conflict
import EditProductModal from '@/components/admin/edit-product-modal'

export default function AdminShopManager() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<any>(null)

    useEffect(() => {
        async function fetchProducts() {
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
            setLoading(false);
        }
        fetchProducts();
    }, [])

    // --- DELETE LOGIC ---
    async function handleDelete(id: string, name: string) {
        const confirmed = window.confirm(`Are you sure you want to purge "${name}" from the Vault? This cannot be undone.`);

        if (confirmed) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProducts(products.filter(p => p._id !== id));
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
                <Link href="/admin/dashboard" className="bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    Back to Dashboard
                </Link>
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
                            <tr key={product._id} className="border-b border-[#D9B36C]/10 hover:bg-[#F2EFDF]/30 transition-colors group">
                                <td className="p-4">
                                    <div className="w-16 h-16 bg-[#F2EFDF] rounded-xl overflow-hidden relative border border-[#D9B36C]/20">
                                        {product.imageUrl && (
                                            <NextImage src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black uppercase">{product.name}</span>
                                            {product.coa?.verified && <ShieldCheck size={14} className="text-emerald-600" />}
                                        </div>
                                        <span className="text-[9px] text-[#1B263B]/40 uppercase tracking-tighter font-black">ID: {product._id.slice(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="p-6 uppercase text-[#D9B36C] tracking-widest text-[10px]">{product.category}</td>
                                <td className="p-6 font-black text-[#590202]">${product.price}</td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/shop/${product.slug}`} target="_blank" className="p-2 bg-[#F2EFDF] rounded-lg hover:bg-[#590202] hover:text-white transition-all">
                                            <ExternalLink size={16} />
                                        </Link>
                                        <button onClick={() => setEditingProduct(product)} className="p-2 bg-[#F2EFDF] text-[#1B263B] rounded-lg hover:bg-[#D9B36C] hover:text-black transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id, product.name)}
                                            className="p-2 bg-[#F2EFDF] text-[#590202] rounded-lg hover:bg-[#590202] hover:text-white transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* --- EDIT MODAL OVERLAY --- */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={(updated) => {
                        // This updates the list instantly without a refresh
                        setProducts(products.map(p => p._id === updated._id ? updated : p))
                    }}
                />
            )}
        </main>
    )
}