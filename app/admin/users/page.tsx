'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ShieldCheck, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UserManagement() {
    const [profiles, setProfiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchProfiles()
    }, [])

    const fetchProfiles = async () => {
        const { data, error } = await supabase.from('profiles').select('*')
        if (data) setProfiles(data)
        setLoading(false)
    }

    const toggleRole = async (profileId: string, currentRole: string, email: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'

        // THE SAFETY PROMPT
        const confirmed = window.confirm(
            `Are you sure you want to make "${email || 'this user'}" an ${newRole.toUpperCase()}?`
        )

        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .update({ role: newRole })
                    .eq('id', profileId)

                if (error) throw error

                // Update local UI state
                setProfiles(profiles.map(p => p.id === profileId ? { ...p, role: newRole } : p))
                alert(`User is now an ${newRole.toUpperCase()}`)
            } catch (error: any) {
                alert("Error updating role. Check RLS policies.")
                console.error(error)
            }
        }
    }

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-[#590202]">SCANNING PROFILES...</div>

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-12">
            <header className="mb-12 border-b border-[#D9B36C]/30 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic text-[#590202] uppercase tracking-tighter">User Directory</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1B263B]/60 mt-2">Managing Access Control</p>
                </div>
                <Link href="/admin/dashboard" className="flex items-center gap-2 bg-[#1B263B] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#590202] transition-all shadow-lg">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-[#D9B36C]/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1B263B] text-white text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6">User ID</th>
                            <th className="p-6">Email / Identifier</th>
                            <th className="p-6">Current Role</th>
                            <th className="p-6 text-right">Access Control</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-[#1B263B]">
                        {profiles.map((profile) => (
                            <tr key={profile.id} className="border-b border-[#D9B36C]/10 hover:bg-[#F2EFDF]/30 transition-colors">
                                <td className="p-6 text-[10px] font-mono text-[#1B263B]/50">{profile.id.slice(0, 12)}...</td>
                                <td className="p-6">{profile.email || "No Email Provided"}</td>
                                <td className="p-6">
                                    {profile.role === 'admin' ? (
                                        <span className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={14} /> ADMIN</span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-[#1B263B]/60"><User size={14} /> USER</span>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => toggleRole(profile.id, profile.role, profile.email)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${profile.role === 'admin'
                                                ? 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white'
                                                : 'bg-[#D9B36C]/20 text-[#1B263B] hover:bg-[#D9B36C] hover:text-black'
                                            }`}
                                    >
                                        {profile.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}