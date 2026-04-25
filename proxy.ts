// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Middleware — boilerplate demo, all routes are publicly accessible
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: proxy.ts
// -----------------------------------------------------------

// Auth and role-checks have been removed for the boilerplate demo.
// /admin routes are fully public — no Supabase session required.
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
