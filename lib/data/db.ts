// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: JSON flat-file data layer — replaces Supabase for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: lib/data/db.ts
// -----------------------------------------------------------

// SERVER-ONLY: This module uses Node.js `fs`. Never import from a Client Component.
// All reads/writes go through this single module so swapping the backend later
// only requires changes here, not across the entire app.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ── Types ────────────────────────────────────────────────────────────────────

export type ProductCOA = {
  verified: boolean;
  id: string;
  authenticator: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  availability: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  coa: ProductCOA;
  created_at: string;
};

// ── File path ────────────────────────────────────────────────────────────────

// `process.cwd()` resolves to the Next.js project root in all environments.
const DB_PATH = path.join(process.cwd(), 'lib', 'data', 'products.json');

// ── Internal helpers ─────────────────────────────────────────────────────────

function readDb(): Product[] {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Product[];
}

function writeDb(products: Product[]): void {
  // Pretty-printed so the JSON file stays human-readable and diffable in git.
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Returns all products, newest first (mirrors the old Supabase order). */
export function getProducts(): Product[] {
  const products = readDb();
  return [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Looks up by slug first, then falls back to id.
 * Matches the multi-strategy lookup the old Supabase shop page used.
 */
export function getProductBySlug(slug: string): Product | null {
  const products = readDb();
  return (
    products.find((p) => p.slug === slug) ??
    products.find((p) => p.id === slug) ??
    null
  );
}

/** Adds a new product and returns the full record with generated id/slug/timestamp. */
export function addProduct(
  data: Omit<Product, 'id' | 'slug' | 'created_at'>
): Product {
  const products = readDb();

  const newProduct: Product = {
    ...data,
    id: crypto.randomUUID(),
    slug: toSlug(data.name),
    created_at: new Date().toISOString(),
  };

  // Prepend so getProducts() naturally returns it first without re-sorting the file.
  products.unshift(newProduct);
  writeDb(products);
  return newProduct;
}

/** Merges `data` into the existing product record. Returns null if id not found. */
export function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'created_at'>>
): Product | null {
  const products = readDb();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  // Regenerate slug when name changes so URLs stay consistent.
  if (data.name && data.name !== products[index].name) {
    data.slug = toSlug(data.name);
  }

  products[index] = { ...products[index], ...data };
  writeDb(products);
  return products[index];
}

/** Removes a product by id. Returns true if deleted, false if not found. */
export function deleteProduct(id: string): boolean {
  const products = readDb();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeDb(filtered);
  return true;
}
