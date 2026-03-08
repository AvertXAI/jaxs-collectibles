//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'
import { ArrowLeft, HardHat } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UnderConstruction() {
    const router = useRouter()

    return (
        <main className="min-h-screen bg-[#F2EFDF] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl w-full bg-white p-10 md:p-16 rounded-[2.5rem] border-4 border-yellow-400 shadow-[0_35px_60px_-15px_rgba(250,204,21,0.2)] relative overflow-hidden">
                {/* Hazard Stripes border effect */}
                <div className="absolute top-0 left-0 w-full h-3 bg-[repeating-linear-gradient(45deg,#facc15,#facc15_15px,#1B263B_15px,#1B263B_30px)]"></div>

                <div className="relative w-full h-64 mb-10 rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center border border-[#1B263B]/10">
                    {/* THE FIX: Pointing to the local public/ directory */}
                    <Image
                        src="/construction-barrier.png"
                        alt="Under Construction Barrier"
                        fill
                        className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                    <HardHat size={80} className="text-yellow-400 relative z-10 drop-shadow-2xl" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#1B263B] uppercase mb-4">
                    Zone Restricted
                </h1>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#590202] mb-8">
                    Mechanic Under Construction
                </p>
                <p className="text-[#1B263B]/60 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                    The Architect is currently forging this module. This sector of the Vault will be accessible in a future deployment phase.
                </p>

                <button
                    onClick={() => router.back()}
                    title="Return to your previous location"
                    className="inline-flex items-center gap-3 bg-[#1B263B] text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-[#1B263B] transition-all shadow-xl"
                >
                    <ArrowLeft size={16} /> Return to Previous Sector
                </button>
            </div>
        </main>
    )
}