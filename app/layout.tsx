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

  // LOGIC: Only hide the header if we are exactly in the Studio/Vault paths
  // This ensures the header shows on /shop, /cart, and the Home page.
  const isStudioView = pathname.startsWith('/vault') || pathname.startsWith('/studio');

  // ADMIN AUTH: Set this to true to see the toolbar during dev
  const showAdminToolbar = true;

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
          {/* 1. ADMIN TOOLBAR: Stays at the absolute top */}
          {showAdminToolbar && <AdminToolbar />}

          {/* 2. SITE HEADER: Shows on all pages EXCEPT the Vault/Studio */}
          {!isStudioView && <Header />}

          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}