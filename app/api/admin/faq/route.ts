// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin FAQ API — CRUD backed by JSON flat-file store
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/admin/faq/route.ts
// -----------------------------------------------------------
import { NextResponse } from 'next/server';
import { getFaqs, addFaq, updateFaq, deleteFaq } from '@/lib/data/faqs-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(getFaqs());
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }
    const faq = addFaq({
      question: body.question,
      answer: body.answer,
      category: body.category || 'General',
      display_order: 0,
    });
    return NextResponse.json([faq]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID required.' }, { status: 400 });
    const updated = updateFaq(body.id, {
      question: body.question,
      answer: body.answer,
      category: body.category || 'General',
    });
    if (!updated) return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    return NextResponse.json([updated]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required.' }, { status: 400 });
    const deleted = deleteFaq(id);
    if (!deleted) return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
