//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { NextResponse } from 'next/server';
import { getDbCortex } from '@/brain/db/cortex';
import { BrainError, ErrorSource } from '@/brain/errors';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await getDbCortex();
        const body = await request.json();
        const { id } = await params;

        console.log(`[BRAIN_CORTEX] Attempting update for Asset ID: ${id}`);

        const { data, error } = await supabase
            .from('products')
            .update({
                name: body.name,
                price: body.price,
                category: body.category,
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error("[DATABASE_CORTEX] Update Error:", error);
            throw new BrainError("Database Update Failed", ErrorSource.DATABASE, 500, error);
        }

        if (!data || data.length === 0) {
            console.warn("[DATABASE_CORTEX] No rows updated. ID might not exist.");
        }

        console.log(`[BRAIN_CORTEX] Asset ${id} successfully refined in Vault.`);
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        const status = error instanceof BrainError ? error.statusCode : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}