//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import type { Metadata, Viewport } from "next";

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