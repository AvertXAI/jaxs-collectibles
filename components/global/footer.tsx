//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: components/global/footer.tsx
//////////////////////////////////////////////////
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, ShieldCheck } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-[#1B263B] border-t-4 border-[#D9B36C] pt-16 pb-10 text-white">

            {/* TRANSACTION FEE & SOCIAL STRIP */}
            <div className="container mx-auto px-8 mb-16 text-center border-b border-white/10 pb-12">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C] mb-8">
                    © 2026 Jax's Collectibles
                </p>
                <div className="flex justify-center gap-8 text-[#F2EFDF]/60">
                    <Instagram size={20} className="hover:text-[#D9B36C] cursor-pointer transition-colors hover:scale-110" />
                    <Facebook size={20} className="hover:text-[#D9B36C] cursor-pointer transition-colors hover:scale-110" />
                    <Twitter size={20} className="hover:text-[#D9B36C] cursor-pointer transition-colors hover:scale-110" />
                    <Youtube size={20} className="hover:text-[#D9B36C] cursor-pointer transition-colors hover:scale-110" />
                </div>
            </div>

            <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 items-start">

                {/* COLUMN 1: BRAND IDENTITY */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    {/* THE FIX: Raised to -mt-12 to lift the logo above the reference line, keeping full size. */}
                    <div className="relative flex items-center justify-center md:justify-start -mt-24 mb-6">
                        <Image
                            src="/logo.png"
                            alt="Jax's Collectibles"
                            width={192} // Large Native Width
                            height={64} // Large Native Height
                            style={{ width: 'auto', height: 'auto', maxHeight: 'none' }} // Strictly prevent shrinking
                            className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        />
                    </div>
                    <p className="text-[#F2EFDF]/60 text-sm leading-relaxed font-medium">
                        The premiere destination for high-asset memorabilia and authenticated collectibles. Every item secured, every transaction verified.
                    </p>
                </div>

                {/* COLUMN 2: THE VAULT SECTORS */}
                <div className="text-center md:text-left">
                    <h4 className="text-[#D9B36C] font-black uppercase tracking-widest text-xs mb-8">The Vault Sectors</h4>
                    <ul className="space-y-4 text-sm font-bold text-[#F2EFDF]/70 uppercase tracking-tighter">
                        <li><Link href="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Inventory</Link></li>
                        <li><Link href="/shop?cat=cards" className="hover:text-white hover:translate-x-1 inline-block transition-all">TCG / Cards</Link></li>
                        <li><Link href="/shop?cat=comics" className="hover:text-white hover:translate-x-1 inline-block transition-all">First Edition Comics</Link></li>
                        <li><Link href="/shop?cat=figures" className="hover:text-white hover:translate-x-1 inline-block transition-all">Statues & Figures</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3: COLLECTOR SERVICES */}
                <div className="text-center md:text-left">
                    <h4 className="text-[#D9B36C] font-black uppercase tracking-widest text-xs mb-8">Collector Services</h4>
                    <ul className="space-y-4 text-sm font-bold text-[#F2EFDF]/70 uppercase tracking-tighter">
                        <li><Link href="/under-construction" className="hover:text-white hover:translate-x-1 inline-block transition-all">Authentication</Link></li>
                        <li><Link href="/under-construction" className="hover:text-white hover:translate-x-1 inline-block transition-all">Grading Logistics</Link></li>
                        <li><Link href="/under-construction" className="hover:text-white hover:translate-x-1 inline-block transition-all">The Ledger</Link></li>
                        <li><Link href="/under-construction" className="hover:text-white hover:translate-x-1 inline-block transition-all">Consignment</Link></li>
                        <li><Link href="/faq" className="hover:text-[#D9B36C] hover:translate-x-1 inline-block transition-all text-white">FAQ & Support</Link></li>
                    </ul>
                </div>

                {/* COLUMN 4: SECURITY & PROTOCOLS */}
                <div className="text-center md:text-left">
                    <h4 className="text-[#D9B36C] font-black uppercase tracking-widest text-xs mb-8">Security & Protocols</h4>
                    <div className="bg-white/5 p-6 rounded-2xl border border-[#D9B36C]/20 backdrop-blur-sm flex flex-col items-center md:items-start">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-[#D9B36C] mb-3">
                            <ShieldCheck size={20} />
                            <span className="font-black uppercase tracking-widest text-[10px]">Verified Vault Integrity</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#F2EFDF]/60 leading-relaxed uppercase tracking-widest text-center md:text-left">
                            Transactions protected by PCI-DSS Level 1 compliance and 256-bit SSL encryption.
                        </p>
                    </div>
                </div>

            </div>

            {/* LEGAL STRIP */}
            <div className="border-t border-white/10 pt-8 container mx-auto px-8 flex flex-col md:flex-row items-center justify-center relative gap-6 md:gap-0">
                <div className="md:absolute left-8 flex gap-6 text-[9px] font-black uppercase tracking-widest text-[#F2EFDF]/40">
                    <Link href="/under-construction" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/under-construction" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#F2EFDF]/40 text-center">
                    All Rights Reserved. Designed by The Architect.
                </p>
                <div className="md:absolute right-8 flex gap-6 text-[9px] font-black uppercase tracking-widest text-[#F2EFDF]/40">
                    <Link href="/under-construction" className="hover:text-white transition-colors">Refund Policy</Link>
                </div>
            </div>
        </footer>
    )
}