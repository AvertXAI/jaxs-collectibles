// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin Products API — delete product by id
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/admin/products/[id]/route.ts
// -----------------------------------------------------------
import { NextResponse } from 'next/server';
import { deleteProduct } from '@/lib/data/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteProduct(id);
    if (!deleted) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
