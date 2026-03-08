//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { NextResponse } from "next/server";
import { getDbCortex } from "@/brain/db/cortex";
import { getAdminCortex } from "@/brain/db/adminCortex";

// THE FIX: Prevents Next.js from caching the empty database state
export const dynamic = 'force-dynamic';

async function verifyClearance() {
    const supabase = await getDbCortex();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    return profile?.role === 'admin' || profile?.role === 'owner';
}

export async function GET() {
    try {
        // THE FIX: Using AdminCortex to ensure 100% read access on the dashboard
        const supabaseAdmin = getAdminCortex();
        const { data, error } = await supabaseAdmin.from('faqs').select('*').order('display_order', { ascending: true });

        if (error) {
            console.error("[FAQ_CORTEX] Read Error:", error);
            return NextResponse.json([]);
        }
        return NextResponse.json(data || []);
    } catch (err) {
        console.error("[FAQ_CORTEX] GET Crash:", err);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    if (!(await verifyClearance())) return NextResponse.json({ error: "Clearance Denied" }, { status: 403 });
    try {
        const body = await req.json();
        const { data, error } = await getAdminCortex().from('faqs').insert([{
            question: body.question,
            answer: body.answer,
            category: body.category || 'General'
        }]).select();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    if (!(await verifyClearance())) return NextResponse.json({ error: "Clearance Denied" }, { status: 403 });
    try {
        const body = await req.json();
        const { data, error } = await getAdminCortex().from('faqs').update({
            question: body.question,
            answer: body.answer,
            category: body.category || 'General'
        }).eq('id', body.id).select();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await verifyClearance())) return NextResponse.json({ error: "Clearance Denied" }, { status: 403 });
    try {
        const { id } = await req.json();
        const { error } = await getAdminCortex().from('faqs').delete().eq('id', id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}