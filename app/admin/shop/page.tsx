//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/admin/shop/page.tsx
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Pencil, Trash2, ArrowLeft, PackageSearch } from 'lucide-react'
import { useSupabase } from '@/components/supabase-provider'
// Imported component trigger will apply its own styles
import { AddProductForm } from '@/components/admin/add-product-form'

export default function AdminInventoryControl() {
    const supabase = useSupabase();
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchInventory() {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error("Inventory Sync Error:", error);
            } finally {
                setLoading(false);
            }
        }
        if (supabase) fetchInventory();
    }, [supabase])

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`SECURITY WARNING: Are you sure you want to permanently purge "${name}" from the Vault?`)) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            setProducts(products.filter(p => p.id !== id));
            alert("Asset successfully purged.");
        } catch (error: any) {
            alert(`Purge Failed: ${error.message}`);
        }
    }

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">

            {/* ADMIN HEADER */}
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">Inventory Control</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">
                        Managing {products.length} Assets in the Vault
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* THE FIX: Standardized secondary button style */}
                    <Link href="/admin/dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg h-auto">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>

                    {/* Component trigger handles its own internal styles (which we just updated!) */}
                    <AddProductForm />
                </div>
            </header>

            {/* INVENTORY LEDGER TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-[#D9B36C]/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1B263B] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6 w-24">Asset Image</th>
                            <th className="p-6">Product Details</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Price</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#1B263B]">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-[#590202] animate-pulse uppercase tracking-[0.3em] font-black">
                                    <PackageSearch className="mx-auto mb-2" size={32} />
                                    Syncing Vault Ledger...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-[#1B263B]/40 uppercase tracking-[0.3em] font-black">
                                    Vault is currently empty.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                // Image Parser for safety
                                let displayImg = '/logo.png';
                                if (Array.isArray(product.images) && product.images.length > 0) displayImg = product.images[0];
                                else if (typeof product.images === 'string') {
                                    try { displayImg = JSON.parse(product.images)[0]; } catch (e) { displayImg = product.images; }
                                } else if (product.image_url) { displayImg = product.image_url; }

                                return (
                                    <tr key={product.id} className="border-b border-[#D9B36C]/10 hover:bg-[#F2EFDF]/30 transition-colors">
                                        <td className="p-4">
                                            <div className="w-16 h-16 bg-[#F2EFDF] rounded-xl relative overflow-hidden border border-[#D9B36C]/30 flex-shrink-0">
                                                <Image src={displayImg} alt={product.name} fill className="object-contain p-2 mix-blend-multiply" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black uppercase text-sm">{product.name}</span>
                                                <ShieldCheck size={14} className="text-emerald-600" />
                                            </div>
                                            <span className="text-[9px] text-[#1B263B]/40 font-mono">ID: {product.id.split('-')[0]}...</span>
                                        </td>
                                        <td className="p-4 text-[10px] font-black text-[#D9B36C] uppercase tracking-widest">
                                            {product.category || 'General'}
                                        </td>
                                        <td className="p-4 font-black text-[#590202] text-sm">
                                            ${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => alert("Edit modal connecting soon...")} className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all" title="Edit Asset">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id, product.name)} className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Purge Asset">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}