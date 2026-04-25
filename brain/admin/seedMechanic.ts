// -----------------------------------------------------------
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI. All Rights Reserved.
// Project: AvertXAI Umbrella Enterprise Web
// Description: Seed mechanic stub — seed route now uses lib/data/products-seed.json directly
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: brain/admin/seedMechanic.ts
// -----------------------------------------------------------
import { BrainError, ErrorSource } from '../errors';

export async function executeDatabaseSeed() {
  throw new BrainError(
    'Use /api/admin/seed route instead — seed is handled via lib/data/products-seed.json',
    ErrorSource.DATABASE,
    501
  );
}
