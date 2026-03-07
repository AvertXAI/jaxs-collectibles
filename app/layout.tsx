'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { supabase } from '@/lib/supabaseClient'
import "./globals.css";
import Header from "@/components/header";
import AdminToolbar from "@/components/admin-toolbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setRole(data?.role || 'user')
      } else {
        setRole(null)
      }
    }
    getRole()

    // Listen for auth changes (login/logout) to update the toolbar instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => getRole())
    return () => subscription.unsubscribe()
  }, [])

  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio');

  // THE FIX: Toolbar only shows for 'admin' or 'owner'
  const showAdminToolbar = role === 'admin' || role === 'owner';

  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`bg-[#FDFBF7] text-[#1A1A1A] antialiased ${geistSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {showAdminToolbar && <AdminToolbar />}

          {!isStudioView && <Header />}

          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}