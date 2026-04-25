// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin Products API — add new product with optional local image upload
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/admin/products/route.ts
// -----------------------------------------------------------
import { NextRequest, NextResponse } from 'next/server';
import { addProduct } from '@/lib/data/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = (formData.get('name') as string || '').trim();
    const price = parseFloat(formData.get('price') as string || '0');
    const category = (formData.get('category') as string || 'General').trim();
    const description = (formData.get('description') as string || 'Classified Vault Asset').trim();
    const imageFile = formData.get('image') as File | null;

    if (!name || isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'Name and valid price are required.' }, { status: 400 });
    }

    let imageUrl = '/logo.png';

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const product = addProduct({
      name,
      price,
      category,
      description,
      stock: 1,
      images: [imageUrl],
      availability: 'available',
      coa: { verified: false, id: '', authenticator: 'Self-Certified' },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
