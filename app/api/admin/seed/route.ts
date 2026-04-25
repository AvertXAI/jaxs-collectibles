// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Seed API — restores products.json from immutable seed backup
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/admin/seed/route.ts
// -----------------------------------------------------------
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const seedPath = path.join(process.cwd(), 'lib', 'data', 'products-seed.json');
    const dbPath = path.join(process.cwd(), 'lib', 'data', 'products.json');
    const seedData = fs.readFileSync(seedPath, 'utf-8');
    fs.writeFileSync(dbPath, seedData, 'utf-8');
    const products = JSON.parse(seedData);
    return NextResponse.json({ success: true, message: `Vault Seeded: ${products.length} Products restored.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
