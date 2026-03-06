import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function SanityNavbar(props: any) {
    return (
        <div className="flex flex-col w-full">
            {/* THE CUSTOM TOP BAR (Sits under the Admin Toolbar) */}
            <div className="bg-[#1B263B] text-white border-b border-white/10 w-full z-[1000]">
                <div className="flex items-center justify-between p-2 px-4">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#D9B36C] transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Admin Dashboard
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Sanity Engine v3.0
                    </span>
                </div>
            </div>

            {/* RENDER DEFAULT SANITY UI */}
            {props.renderDefault(props)}
        </div>
    )
}