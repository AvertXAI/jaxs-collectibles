//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: components/auth-confirmation.tsx
//////////////////////////////////////////////////
'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'

export default function AuthConfirmation() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Check URL for Supabase hash (indicates a verified email return)
        const hasHash = window.location.hash.includes('access_token')
        const isDismissed = document.cookie.includes('vault_auth_confirmed=true')

        if (hasHash && !isDismissed) {
            setShow(true)
        }
    }, [])

    const dismiss = () => {
        // Save to cookie for 7 days
        document.cookie = "vault_auth_confirmed=true; max-age=" + 60 * 60 * 24 * 7 + "; path=/"
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed bottom-8 right-8 z-[12000] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-[#1B263B] text-white p-6 rounded-[2rem] shadow-2xl border border-[#D9B36C]/30 flex items-center gap-6 max-w-md">
                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-widest text-xs mb-1">Identity Verified</h4>
                    <p className="text-[10px] text-white/60 uppercase font-bold">Your vault access has been authorized.</p>
                </div>
                <button onClick={dismiss} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}