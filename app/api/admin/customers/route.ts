//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { NextResponse } from "next/server";
import { fetchCustomerIntelligence } from "@/brain/users/customerMechanic";
import { logBrainFailure } from "@/brain/logger";
import { BrainError } from "@/brain/errors";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'Joined';
        const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

        const data = await fetchCustomerIntelligence(page, 10, search, sortBy, sortOrder);
        return NextResponse.json({ success: true, ...data });

    } catch (error: any) {
        logBrainFailure(error);
        const status = error instanceof BrainError ? error.statusCode : 500;
        const source = error instanceof BrainError ? error.source : "UNKNOWN_CORTEX";

        return NextResponse.json({
            success: false,
            error: error.message || "Internal Brain Failure",
            origin: source
        }, { status });
    }
}