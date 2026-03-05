'use client'

export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { seedProducts } from "@/lib/seed-data";
import { useState } from "react";

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SeedPage() {
    const [status, setStatus] = useState("Ready to push 50 luxury items to Supabase...");
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus("Opening the Vault doors...");

        // Check if env variables are loaded
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setStatus("Error: Supabase URL missing in .env.local");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .insert(seedProducts);

        if (error) {
            console.error("Full Supabase Error:", error);
            setStatus(`Vault Error: ${error.message} - ${error.details}`);
            setLoading(false);
        } else {
            setStatus("Success! 50 items successfully secured in the database.");
            setLoading(false);
        }
    };

    return (
        <div className="p-20 bg-[#F2EFDF] min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-[#D9B36C]/30 max-w-lg text-center">
                <h1 className="text-3xl font-bold text-[#1B263B] mb-4 uppercase tracking-tighter">
                    The Vault Seeder
                </h1>
                <div className={`mb-8 p-4 rounded-lg text-sm font-medium ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-[#590202]'}`}>
                    {status}
                </div>

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className={`px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all shadow-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#590202] text-[#F2EFDF] hover:bg-[#1B263B] active:scale-95'}`}
                >
                    {loading ? "Syncing..." : "Push 50 Items"}
                </button>
            </div>
        </div>
    );
}