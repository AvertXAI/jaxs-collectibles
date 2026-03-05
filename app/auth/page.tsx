"use client";

import { useState } from "react";
import { usePathname } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function AuthPage() {
    const pathname = usePathname();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAction = async (type: 'signin' | 'signup') => {
        setLoading(true);
        const { data, error } = type === 'signup'
            ? await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/auth/confirm` }
            })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(error.message);
        } else if (type === 'signup') {
            alert("Check your email to confirm your vault access!");
        } else if (data?.user) {
            // Check role for automatic vault redirect
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (profile?.role === 'admin') {
                window.location.href = "/vault";
            } else {
                window.location.href = "/";
            }
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-600">
            <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex gap-4">
                    <a href="#" className="hover:text-purple-500 transition-colors"><Instagram size={20} /></a>
                    <a href="#" className="hover:text-purple-500 transition-colors"><Facebook size={20} /></a>
                    <a href="#" className="hover:text-purple-500 transition-colors"><Twitter size={20} /></a>
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter">JAX'S COLLECTIBLES</h1>
                <div className="flex items-center gap-4">
                    <a href="/" className="border border-white/20 px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Home</a>
                </div>
            </nav>

            <div className="flex flex-col items-center justify-center pt-20 px-4">
                <div className="w-full max-w-md space-y-8 border border-white/10 p-10 bg-zinc-950 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                    <div className="text-center">
                        <h2 className="text-4xl font-black italic tracking-tighter mb-2">VAULT ACCESS</h2>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Authorized Personnel Only</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900 border-white/10 h-12 text-sm focus:border-purple-600 transition-colors rounded-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border-white/10 h-12 text-sm focus:border-purple-600 transition-colors rounded-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                onClick={() => handleAction('signin')}
                                disabled={loading}
                                className="w-full bg-white text-black font-black italic text-lg h-14 hover:bg-purple-700 hover:text-white transition-all rounded-none"
                            >
                                {loading ? "AUTHENTICATING..." : "LOGIN"}
                            </Button>
                            <Button
                                onClick={() => handleAction('signup')}
                                disabled={loading}
                                variant="outline"
                                className="w-full border-white/10 text-white font-black italic text-lg h-14 hover:bg-zinc-900 transition-all rounded-none"
                            >
                                CREATE ACCOUNT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="p-10 border-t border-white/10 text-center mt-20">
                <p className="text-[10px] text-gray-600 mb-6 tracking-[0.3em]">© 2026 JAX'S COLLECTIBLES | 5% TRANSACTION FEE APPLIES</p>
            </footer>
        </main>
    );
}