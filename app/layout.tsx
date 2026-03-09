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
import SupabaseProvider from '@/components/supabase-provider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

// Example of what it should look like:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="...">
        {/* ADD THIS WRAPPER */}
        <SupabaseProvider>

          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSidebar />
          </CartProvider>

          {/* ADD THIS CLOSING TAG */}
        </SupabaseProvider>
      </body>
    </html>
  );
}