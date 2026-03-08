//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
export default function VerifyEmailPage() {
    return (
        <main className="min-h-screen bg-[#F2EFDF] flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-[#D9B36C]/20 shadow-2xl">
                <h2 className="text-5xl font-black italic tracking-tighter text-[#590202] uppercase mb-4">Check the Vault</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B263B]/60 mb-8">Verification Link Dispatched</p>
                <div className="space-y-4 text-[#1B263B] font-medium leading-relaxed">
                    <p>We've sent a secure confirmation link to your inbox. You must authorize this identity before accessing the inventory.</p>
                </div>
                <a href="/auth" className="mt-10 inline-block bg-[#1B263B] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all">
                    Return to Login
                </a>
            </div>
        </main>
    );
}