//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/onboarding/page.tsx
//////////////////////////////////////////////////
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileIntelligence } from '@/brain/users/profileMechanic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, UserCircle, Phone, Loader2 } from 'lucide-react'

export default function OnboardingPage() {
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateProfileIntelligence(form)
            window.location.href = '/' // Force reload to refresh Identity Context
        } catch (err) {
            alert("Vault Sync Failed. Check Connection.")
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F2EFDF] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl border border-[#D9B36C]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#590202]"></div>

                <header className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#590202]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#590202]">
                        <UserCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-black italic text-[#1B263B] uppercase tracking-tighter">Complete Identity</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D9B36C] mt-2">Secure Your Vault Profile</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase ml-2 text-[#1B263B]/60">First Name</Label>
                            <Input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="rounded-2xl h-14 bg-[#FDFBF7]" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase ml-2 text-[#1B263B]/60">Last Name</Label>
                            <Input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="rounded-2xl h-14 bg-[#FDFBF7]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-[#1B263B]/60">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D9B36C]" size={18} />
                            <Input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-2xl h-14 pl-12 bg-[#FDFBF7]" placeholder="(555) 000-0000" />
                        </div>
                    </div>

                    <Button disabled={isSaving} className="w-full h-16 bg-[#1B263B] text-white hover:bg-[#590202] rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">
                        {isSaving ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                        {isSaving ? "SYNCING..." : "AUTHORIZE PROFILE"}
                    </Button>
                </form>

                <p className="text-[9px] text-center mt-8 text-[#1B263B]/40 uppercase font-bold tracking-widest leading-relaxed">
                    By authorizing, you verify that this information is accurate for delivery logistics and asset verification.
                </p>
            </div>
        </div>
    )
}