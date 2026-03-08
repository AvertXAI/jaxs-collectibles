'use client'
import { useState } from "react";
import Link from 'next/link';
import { ArrowLeft, Database } from 'lucide-react';

export default function SeedPage() {
    const [status, setStatus] = useState("Ready to inject Products and Mock Users...");
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus("Executing Military-Grade Server Seed...");

        try {
            const res = await fetch('/api/admin/seed', { method: 'POST' });
            const result = await res.json();

            if (result.success) {
                setStatus(`Success! ${result.message}`);
            } else {
                setStatus(`Error [${result.origin}]: ${result.error}`);
            }
        } catch (err) {
            setStatus("Critical Network Failure.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">The Vault Seeder</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Automated Inventory & Identity Injection</p>
                </div>
                <Link href="/admin/dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
            </header>

            <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-[#D9B36C]/20 max-w-lg w-full text-center">
                    <Database size={48} className="mx-auto text-blue-600 mb-6" />
                    <h2 className="text-2xl font-black text-[#1B263B] mb-4 uppercase tracking-tighter">Inject Mock Data</h2>

                    <div className={`mb-8 p-4 rounded-xl text-sm font-bold uppercase tracking-widest ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-[#F2EFDF] text-[#590202]'}`}>
                        {status}
                    </div>

                    <button
                        onClick={handleSeed}
                        disabled={loading}
                        className={`w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B263B] text-white hover:bg-[#590202] active:scale-95'}`}
                    >
                        {loading ? "SYNCING CORTEX..." : "EXECUTE SEED PROTOCOL"}
                    </button>
                </div>
            </div>
        </main>
    );
}