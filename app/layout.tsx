//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: app/layout.tsx
//////////////////////////////////////////////////
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import AdminToolbar from "@/components/admin-toolbar";
import AdminSessionGuard from "@/components/admin-session-guard";
import AuthConfirmation from "@/components/auth-confirmation";
import { Footer } from '@/components/global/footer';
import { CartProvider } from '@/context/CartContext';
import { CartSidebar } from '@/components/global/cart-sidebar';
import SupabaseProvider from '@/components/supabase-provider';
import { IdentityProvider } from '@/context/IdentityContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        <SupabaseProvider>
          <IdentityProvider>
            <CartProvider>
              {/* These components handle their own client-side checks internally */}
              <AdminToolbar />
              <AdminSessionGuard />
              <AuthConfirmation />

              <Header />
              <main>{children}</main>
              <Footer />
              <CartSidebar />
            </CartProvider>
          </IdentityProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}