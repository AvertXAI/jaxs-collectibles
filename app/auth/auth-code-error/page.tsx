export default function AuthErrorPage() {
    return (
        <main className="min-h-screen bg-[#F2EFDF] flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-[#D9B36C]/20 shadow-2xl">
                <h2 className="text-5xl font-black italic tracking-tighter text-[#590202] uppercase mb-4">Link Expired</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B263B]/60 mb-8">Security Timeout Detected</p>
                <div className="space-y-4 text-[#1B263B] font-medium leading-relaxed">
                    <p>The verification link has expired or has already been used. For your protection, these tokens are only valid for a single use.</p>
                </div>
                <a href="/auth" className="mt-10 inline-block bg-[#1B263B] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all">
                    Request New Link
                </a>
            </div>
        </main>
    );
}