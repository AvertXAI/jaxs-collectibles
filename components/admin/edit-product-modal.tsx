//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: components/admin/edit-product-modal.tsx
//////////////////////////////////////////////////
'use client'
import { useState } from 'react'
import { Save, X } from 'lucide-react'

interface EditModalProps {
    product: any;
    onClose: () => void;
    onUpdate: (updatedProduct: any) => void;
}

export default function EditProductModal({ product, onClose, onUpdate }: EditModalProps) {
    // Ensuring we capture the correct Supabase ID
    const productId = product.id;

    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        category: product.category
    })

    const handleSave = async () => {
        if (!productId) {
            alert("Error: Missing Product ID. Update aborted.");
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                onUpdate({ ...product, ...formData })
                onClose()
            } else {
                const errData = await response.json();
                alert(`Update failed: ${errData.error || 'Check server logs'}`);
            }
        } catch (error) {
            console.error("Update failed:", error)
        }
    }

    return (
        <div className="fixed inset-0 bg-[#1B263B]/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-[#F2EFDF] w-full max-w-lg rounded-[2.5rem] p-10 border border-[#D9B36C]/30 shadow-2xl relative">
                <button onClick={onClose} title="Close Modal" className="absolute top-6 right-6 text-[#1B263B]/40 hover:text-[#590202]">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-black italic text-[#590202] uppercase mb-8">Refine Vault Asset</h2>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Product Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white border border-[#D9B36C]/20 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#590202]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Price ($)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-white border border-[#D9B36C]/20 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#590202]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Category</label>
                            <input
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white border border-[#D9B36C]/20 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#590202]"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    title="Commit changes to Database"
                    className="w-full bg-[#590202] text-white py-4 rounded-xl mt-10 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#1B263B] transition-all"
                >
                    <Save size={18} /> Update Asset in Vault
                </button>
            </div>
        </div>
    )
}