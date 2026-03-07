"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { Instagram, Facebook, Twitter, ShieldAlert } from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'signin' | 'signup'>('signin');

    const handleAction = async (type: 'signin' | 'signup') => {
        setLoading(true);

        // 1. WATCHDOG TIMER: Prevents the 10-second hang you saw earlier
        const timeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                console.error("AUTH_TIMEOUT: The Vault failed to respond.");
                alert("Security handshake timed out. Please refresh and try again.");
            }
        }, 10000);

        try {
            const { data, error } = type === 'signup'
                ? await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
                })
                : await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            // 2. SUCCESS: Kill the timer
            clearTimeout(timeout);

            if (type === 'signup') {
                router.push('/auth/verify');
            } else if (data?.user) {
                // Check role for automatic dashboard redirect
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                // 3. THE FIX: Send Owner/Admin to dashboard, others to Home
                const hasClearance = profile?.role === 'admin' || profile?.role === 'owner';

                // We use window.location.href for a clean state flush on login
                window.location.href = hasClearance ? "/admin/dashboard" : "/";
            }
        } catch (err: any) {
            clearTimeout(timeout);
            console.error("VAULT_ACCESS_ERROR:", err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F2EFDF] text-[#1B263B] font-sans selection:bg-[#590202] selection:text-white">
            <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto border-b border-[#D9B36C]/20">
                <div className="flex gap-4">
                    <a href="#" className="hover:text-[#590202] transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="hover:text-[#590202] transition-colors"><Facebook size={20} /></a>
                    <a href="#" className="hover:text-[#590202] transition-colors"><Twitter size={20} /></a>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-[#590202]">JAX'S COLLECTIBLES</h1>
            </nav>

            <div className="flex flex-col items-center justify-center pt-20 px-4">
                <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(89,2,2,0.1)] border border-[#D9B36C]/10">
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4 text-[#590202]">
                            <ShieldAlert size={40} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase text-[#590202]">
                            {view === 'signin' ? "Vault Access" : "Secure Entry"}
                        </h2>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#1B263B]/40 font-bold">
                            {view === 'signin' ? "Authorized Personnel Only" : "Register New Identity"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <input
                            type="email"
                            placeholder="IDENTIFICATION (EMAIL)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F2EFDF]/50 border-b-2 border-[#1B263B]/10 p-4 focus:border-[#590202] outline-none font-bold uppercase text-xs tracking-widest transition-all"
                        />
                        <input
                            type="password"
                            placeholder="ACCESS KEY (PASSWORD)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#F2EFDF]/50 border-b-2 border-[#1B263B]/10 p-4 focus:border-[#590202] outline-none font-bold uppercase text-xs tracking-widest transition-all"
                        />

                        <button
                            onClick={() => handleAction(view)}
                            disabled={loading}
                            className="w-full bg-[#1B263B] text-white font-black italic text-xl h-16 hover:bg-[#590202] transform hover:-translate-y-1 transition-all shadow-xl rounded-2xl"
                        >
                            {loading ? "VERIFYING..." : view === 'signin' ? "UNSEAL VAULT" : "CREATE IDENTITY"}
                        </button>

                        <button
                            onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}
                            className="w-full text-[10px] font-black uppercase tracking-widest text-[#1B263B]/40 hover:text-[#590202] transition-colors"
                        >
                            {view === 'signin' ? "Request New Credentials (Sign Up)" : "Back to Login"}
                        </button>
                    </div>
                </div>
            </div>

            <footer className="p-10 border-t border-[#D9B36C]/10 text-center mt-20">
                <p className="text-[10px] text-[#1B263B]/30 mb-6 tracking-[0.3em] font-black">© 2026 JAX'S COLLECTIBLES | SECURE VAULT TECHNOLOGY</p>
            </footer>
        </main>
    );
}