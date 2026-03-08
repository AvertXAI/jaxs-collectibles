import { NextResponse } from "next/server";
import { executeDatabaseSeed } from "@/brain/admin/seedMechanic";
import { logBrainFailure } from "@/brain/logger";
import { BrainError } from "@/brain/errors";

export async function POST() {
    try {
        const result = await executeDatabaseSeed();
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        logBrainFailure(error);
        const status = error instanceof BrainError ? error.statusCode : 500;
        const source = error instanceof BrainError ? error.source : "UNKNOWN_CORTEX";
        return NextResponse.json({ success: false, error: error.message, origin: source }, { status });
    }
}