// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Purge API — resets products.json to empty for boilerplate demo
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: app/api/admin/purge/route.ts
// -----------------------------------------------------------
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE() {
  try {
    const dbPath = path.join(process.cwd(), 'lib', 'data', 'products.json');
    fs.writeFileSync(dbPath, '[]', 'utf-8');
    return NextResponse.json({ success: true, message: 'Vault inventory purged.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
