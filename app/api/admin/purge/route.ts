//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { NextResponse } from "next/server";
import { executeDatabasePurge } from "@/brain/owner/purgeMechanic";
import { logBrainFailure } from "@/brain/logger";
import { BrainError } from "@/brain/errors";

export async function DELETE() {
    try {
        const result = await executeDatabasePurge();
        return NextResponse.json({ success: true, ...result });
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