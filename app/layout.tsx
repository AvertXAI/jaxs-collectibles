'use client'

import { usePathname } from 'next/navigation'
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
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

  // Logic: Only hide the header if we are exactly in the Studio/Vault paths
  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio');

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
          {/* ADMIN TOOLBAR: We mount it globally.
              The component itself handles its own "Hidden Guard"
              logic to prevent deadlocks in the root.
          */}
          <AdminToolbar />

          {/* SITE HEADER: Shows on all pages EXCEPT the Vault/Studio */}
          {!isStudioView && <Header />}

          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}