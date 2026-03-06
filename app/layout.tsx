import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/header";
import AdminToolbar from "@/components/admin-toolbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Jax's Collectibles",
  description: "The best high quality collectibles for your collection. From rare action figures to limited edition items, we have something for every collector.",
};

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
  // NOTE: In a real app, you'd check a cookie/session here to hide the toolbar from customers
  const showAdminToolbar = true;

  return (
    <html lang="en" className="light" style={{colorScheme: 'light'}}>
      <body className="bg-[#FDFBF7] text-[#1A1A1A] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* THE DUAL-VIEW SELECTOR */}
          {showAdminToolbar && <AdminToolbar />}

          {/* STICKY HEADER */}
          {/* 1. Header MUST be above children to stay at the top */}
          <Header />
          <main>
          {/* 2. Page content goes here */}
          {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
