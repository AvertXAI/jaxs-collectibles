// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Admin cortex stub — no-op mock client for boilerplate demo (Supabase removed)
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: brain/db/adminCortex.ts
// -----------------------------------------------------------
import { mockBrainClient } from './cortex';

export function getAdminCortex() {
  return mockBrainClient as any;
}
