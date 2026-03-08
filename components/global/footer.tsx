import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, ShieldCheck } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-white border-t border-[#D9B36C]/20 pt-20 pb-10">
            <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

                {/* COLUMN 1: BRAND IDENTITY */}
                <div className="space-y-6">
                    <Image src="/logo.png" alt="Jax's Collectibles" width={180} height={60} className="grayscale hover:grayscale-0 transition-all duration-500" />
                    <p className="text-[#1B263B]/60 text-sm leading-relaxed font-medium">
                        The premiere destination for high-asset memorabilia and authenticated collectibles. Every item secured, every transaction verified.
                    </p>
                    <div className="flex gap-4 text-[#1B263B]/40">
                        <Facebook size={20} className="hover:text-[#590202] cursor-pointer transition-colors" />
                        <Twitter size={20} className="hover:text-[#590202] cursor-pointer transition-colors" />
                        <Instagram size={20} className="hover:text-[#590202] cursor-pointer transition-colors" />
                        <Youtube size={20} className="hover:text-[#590202] cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* COLUMN 2: THE VAULT SECTORS */}
                <div>
                    <h4 className="text-[#1B263B] font-black uppercase tracking-widest text-xs mb-8">The Vault Sectors</h4>
                    <ul className="space-y-4 text-sm font-bold text-[#1B263B]/60 uppercase tracking-tighter">
                        <li><Link href="/shop" className="hover:text-[#590202] transition-colors">All Inventory</Link></li>
                        <li><Link href="/shop?cat=cards" className="hover:text-[#590202] transition-colors">TCG / Cards</Link></li>
                        <li><Link href="/shop?cat=comics" className="hover:text-[#590202] transition-colors">First Edition Comics</Link></li>
                        <li><Link href="/shop?cat=figures" className="hover:text-[#590202] transition-colors">Statues & Figures</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3: COLLECTOR SERVICES */}
                <div>
                    <h4 className="text-[#1B263B] font-black uppercase tracking-widest text-xs mb-8">Collector Services</h4>
                    <ul className="space-y-4 text-sm font-bold text-[#1B263B]/60 uppercase tracking-tighter">
                        <li><Link href="/under-construction" className="hover:text-[#590202] transition-colors">Authentication Submission</Link></li>
                        <li><Link href="/under-construction" className="hover:text-[#590202] transition-colors">Grading Logistics</Link></li>
                        <li><Link href="/under-construction" className="hover:text-[#590202] transition-colors">The Authenticity Ledger</Link></li>
                        <li><Link href="/under-construction" className="hover:text-[#590202] transition-colors">Consignment Programs</Link></li>
                    </ul>
                </div>

                {/* COLUMN 4: SECURITY & PROTOCOLS */}
                <div>
                    <h4 className="text-[#1B263B] font-black uppercase tracking-widest text-xs mb-8">Security & Protocols</h4>
                    <div className="bg-[#F2EFDF] p-6 rounded-2xl border border-[#D9B36C]/20">
                        <div className="flex items-center gap-3 text-[#590202] mb-3">
                            <ShieldCheck size={20} />
                            <span className="font-black uppercase tracking-widest text-[10px]">Verified Vault Integrity</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#1B263B]/50 leading-relaxed uppercase tracking-widest">
                            Transactions protected by PCI-DSS Level 1 compliance and 256-bit SSL encryption.
                        </p>
                    </div>
                </div>

            </div>

            {/* LEGAL STRIP */}
            <div className="border-t border-[#D9B36C]/10 pt-8 container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#1B263B]/30">
                    © 2026 Jax's Collectibles. All Rights Reserved. Designed by The Architect.
                </p>
                <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-[#1B263B]/30">
                    <Link href="/under-construction" className="hover:text-[#1B263B]">Privacy Policy</Link>
                    <Link href="/under-construction" className="hover:text-[#1B263B]">Terms of Service</Link>
                    <Link href="/under-construction" className="hover:text-[#1B263B]">Refund Policy</Link>
                </div>
            </div>
        </footer>
    )
}