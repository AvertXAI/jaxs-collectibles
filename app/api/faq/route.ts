// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Public FAQ API — returns all FAQs from JSON store
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/faq/route.ts
// -----------------------------------------------------------
import { NextResponse } from 'next/server';
import { getFaqs } from '@/lib/data/faqs-db';

export async function GET() {
  try {
    const faqs = getFaqs();
    return NextResponse.json(faqs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
