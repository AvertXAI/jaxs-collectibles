//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
export default function ContactPage() {
    return (
        <main className="min-h-screen pt-20 px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-black italic text-[#590202] uppercase tracking-tighter">
                    Establish Contact
                </h1>
                <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#D9B36C] mt-4">
                    Submit your assets for the authentication queue
                </p>
            </div>

            <div className="bg-white border border-[#D9B36C]/20 rounded-[3rem] p-10 md:p-16 shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-[#F2EFDF] rounded-2xl p-5 text-sm outline-none border-2 border-transparent focus:border-[#590202] transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Email</label>
                        <input type="email" placeholder="collector@vault.com" className="w-full bg-[#F2EFDF] rounded-2xl p-5 text-sm outline-none border-2 border-transparent focus:border-[#590202] transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Item Description</label>
                        <textarea placeholder="Tell us about the piece..." rows={4} className="w-full bg-[#F2EFDF] rounded-2xl p-5 text-sm outline-none border-2 border-transparent focus:border-[#590202] transition-all" />
                    </div>
                    <button className="md:col-span-2 bg-[#1B263B] text-white font-black py-6 rounded-2xl uppercase tracking-widest text-sm hover:bg-[#590202] transition-all shadow-xl">
                        Send Authentication Request
                    </button>
                </form>
            </div>
        </main>
    )
}