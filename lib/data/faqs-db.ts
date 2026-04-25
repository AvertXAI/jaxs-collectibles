// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: FAQ JSON flat-file data layer for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: lib/data/faqs-db.ts
// -----------------------------------------------------------

// SERVER-ONLY: Uses Node.js `fs`. Never import from a Client Component.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  created_at: string;
};

const DB_PATH = path.join(process.cwd(), 'lib', 'data', 'faqs.json');

function readDb(): FAQ[] {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as FAQ[];
}

function writeDb(faqs: FAQ[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(faqs, null, 2), 'utf-8');
}

export function getFaqs(): FAQ[] {
  return readDb().sort((a, b) => a.display_order - b.display_order);
}

export function addFaq(data: Omit<FAQ, 'id' | 'created_at'>): FAQ {
  const faqs = readDb();
  const maxOrder = faqs.reduce((max, f) => Math.max(max, f.display_order), 0);
  const newFaq: FAQ = {
    ...data,
    id: `faq-${crypto.randomUUID().split('-')[0]}`,
    display_order: maxOrder + 1,
    created_at: new Date().toISOString(),
  };
  faqs.push(newFaq);
  writeDb(faqs);
  return newFaq;
}

export function updateFaq(id: string, data: Partial<Omit<FAQ, 'id' | 'created_at'>>): FAQ | null {
  const faqs = readDb();
  const idx = faqs.findIndex(f => f.id === id);
  if (idx === -1) return null;
  faqs[idx] = { ...faqs[idx], ...data };
  writeDb(faqs);
  return faqs[idx];
}

export function deleteFaq(id: string): boolean {
  const faqs = readDb();
  const filtered = faqs.filter(f => f.id !== id);
  if (filtered.length === faqs.length) return false;
  writeDb(filtered);
  return true;
}
