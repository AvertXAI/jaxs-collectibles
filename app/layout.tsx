// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Root layout — Supabase/Identity providers removed for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/layout.tsx
// -----------------------------------------------------------
import { Geist } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        <CartProvider>
          <AdminToolbar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
