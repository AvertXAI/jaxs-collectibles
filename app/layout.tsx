//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use client'

import { usePathname } from 'next/navigation'
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/header";
import AdminToolbar from "@/components/admin-toolbar";
import { Footer } from '@/components/global/footer'

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

  // Logic: Only hide the header if we are in the Studio/Vault/Admin paths
  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio') || pathname.startsWith('/admin');

  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`bg-[#FDFBF7] text-[#1A1A1A] antialiased ${geistSans.variable} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AdminToolbar />

          {/* SITE HEADER: Shows on public pages */}
          {!isStudioView && <Header />}

          <main className="relative flex-grow">
            {children}
          </main>

          {/* GLOBAL FOOTER */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}