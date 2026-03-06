export default function BlogPage() {
    return (
        <main className="min-h-screen pt-20 px-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="border-b-4 border-[#590202] pb-6 mb-12">
                <h1 className="text-6xl md:text-8xl font-black italic text-[#590202] uppercase tracking-tighter">
                    The Ledger
                </h1>
                <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#D9B36C] mt-2">
                    Official Authenticity Reports & Collector Insights
                </p>
            </div>

            {/* Content Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                <div className="aspect-[16/9] bg-[#F2EFDF] rounded-[2rem] border border-[#D9B36C]/20 flex items-center justify-center">
                    <p className="font-black italic text-2xl text-[#1B263B]/20">SCANNING FOR ARTICLES...</p>
                </div>
                <div className="flex flex-col justify-center gap-4">
                    <span className="badge-new w-fit">Upcoming</span>
                    <h2 className="text-3xl font-black text-[#1B263B] uppercase">The Science of 1st Edition Authentication</h2>
                    <p className="text-sm text-[#1B263B]/60 leading-relaxed font-medium">
                        A deep dive into the specific ink-weight and holographic patterns we look for in the Vault.
                    </p>
                </div>
            </div>
        </main>
    )
}