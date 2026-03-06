'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { AlertTriangle, LogOut } from 'lucide-react'

// --- CONFIGURATION ---
const IDLE_TIMEOUT_MS = 15 * 60 * 1000 // 15 Minutes of no mouse/keyboard activity
const TAB_AWAY_TIMEOUT_MS = 2 * 60 * 1000 // 2 Minutes of being on another tab
const WARNING_DURATION_SEC = 30 // 30 Seconds to respond to the prompt

export default function AdminSessionGuard() {
    const [showWarning, setShowWarning] = useState(false)
    const [countdown, setCountdown] = useState(WARNING_DURATION_SEC)
    const [reason, setReason] = useState<'idle' | 'tab'>('idle')

    const activityTimer = useRef<NodeJS.Timeout | null>(null)
    const tabTimer = useRef<NodeJS.Timeout | null>(null)
    const countdownInterval = useRef<NodeJS.Timeout | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // THE KILL SWITCH
    const executeLogout = useCallback(async () => {
        await supabase.auth.signOut()
        window.location.href = '/' // Hard redirect to wipe cache
    }, [supabase])

    // START THE COUNTDOWN UI
    const triggerWarning = useCallback((triggerReason: 'idle' | 'tab') => {
        setReason(triggerReason)
        setShowWarning(true)
        setCountdown(WARNING_DURATION_SEC)

        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current!)
                    executeLogout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [executeLogout])

    // RESET EVERYTHING (User clicked "I'm still here")
    const resetTimers = useCallback(() => {
        if (countdownInterval.current) clearInterval(countdownInterval.current)
        if (activityTimer.current) clearTimeout(activityTimer.current)
        if (tabTimer.current) clearTimeout(tabTimer.current)

        setShowWarning(false)
        setCountdown(WARNING_DURATION_SEC)

        // Restart Idle Timer
        activityTimer.current = setTimeout(() => triggerWarning('idle'), IDLE_TIMEOUT_MS)
    }, [triggerWarning])

    // MOUNT EVENT LISTENERS
    useEffect(() => {
        // 1. Tab Visibility Tracking
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User left the tab, start the 2-minute clock
                tabTimer.current = setTimeout(() => triggerWarning('tab'), TAB_AWAY_TIMEOUT_MS)
            } else {
                // User came back. If warning isn't showing, clear the tab timer.
                if (tabTimer.current) clearTimeout(tabTimer.current)
            }
        }

        // 2. Mouse/Keyboard Tracking
        const handleActivity = () => {
            if (!showWarning) resetTimers()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('mousemove', handleActivity)
        window.addEventListener('keydown', handleActivity)
        window.addEventListener('click', handleActivity)
        window.addEventListener('scroll', handleActivity)

        // Init first timer
        resetTimers()

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('mousemove', handleActivity)
            window.removeEventListener('keydown', handleActivity)
            window.removeEventListener('click', handleActivity)
            window.removeEventListener('scroll', handleActivity)
            if (activityTimer.current) clearTimeout(activityTimer.current)
            if (tabTimer.current) clearTimeout(tabTimer.current)
            if (countdownInterval.current) clearInterval(countdownInterval.current)
        }
    }, [resetTimers, showWarning, triggerWarning])

    // If no warning, render nothing.
    if (!showWarning) return null

    return (
        <div className="fixed inset-0 bg-[#1B263B]/90 backdrop-blur-md z-[11000] flex items-center justify-center p-4">
            <div className="bg-[#F2EFDF] w-full max-w-md rounded-[2rem] p-8 border border-[#590202]/30 shadow-2xl relative animate-in fade-in zoom-in duration-300 text-center">
                <div className="w-16 h-16 bg-[#590202]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#590202]">
                    <AlertTriangle size={32} />
                </div>

                <h2 className="text-2xl font-black italic text-[#590202] uppercase mb-2">
                    {reason === 'tab' ? 'Tab Inactive' : 'Session Idle'}
                </h2>

                <p className="text-[12px] font-bold text-[#1B263B]/70 uppercase tracking-widest mb-6 leading-relaxed">
                    Security protocols require active monitoring. You will be signed out in:
                </p>

                <div className="text-6xl font-black text-[#1B263B] mb-8 font-mono">
                    00:{countdown.toString().padStart(2, '0')}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={executeLogout}
                        className="flex-1 bg-white border border-[#1B263B]/20 text-[#1B263B] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#1B263B] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} /> Logout Now
                    </button>
                    <button
                        onClick={resetTimers}
                        className="flex-1 bg-[#590202] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#D9B36C] hover:text-[#1B263B] transition-all"
                    >
                        I'm Here
                    </button>
                </div>
            </div>
        </div>
    )
}