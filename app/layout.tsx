//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/header";
import AdminToolbar from "@/components/admin-toolbar";
import { Footer } from '@/components/global/footer';
import { CartProvider } from '@/context/CartContext';
import { CartSidebar } from '@/components/global/cart-sidebar';

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
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`bg-[#FDFBF7] text-[#1A1A1A] antialiased ${geistSans.variable} min-h-screen flex flex-col`}>
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AdminToolbar />

            <CartSidebar />

            <Header />

            <main className="relative flex-grow">
              {children}
            </main>

            <Footer />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}