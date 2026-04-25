// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Products API — paginated list from JSON flat-file store
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/products/route.ts
// -----------------------------------------------------------
import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '12'));

  const search = searchParams.get('search') || '';
  let all = getProducts();
  if (search) {
    const s = search.toLowerCase();
    all = all.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s)
    );
  }
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit;
  const products = all.slice(from, from + limit);

  return NextResponse.json({ products, total, page, totalPages });
}
