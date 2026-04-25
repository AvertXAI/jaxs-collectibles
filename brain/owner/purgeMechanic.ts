//---------------------------------------------------------------------
// Project: Jax's Collectibles
// Description: Collecibles that are authenticated.
// Author: Jason Cruz
// Copyright: (c) 2026 AvertXAI.All Rights Reserved.
// License: Proprietary / Unauthorized copying of this file is strictly prohibited
// File: owner/purgeMechanic.ts
//---------------------------------------------------------------------

import { getAdminCortex } from '../db/adminCortex';
import { getDbCortex } from '../db/cortex';
import { BrainError, ErrorSource } from '../errors';

export async function executeDatabasePurge() {
    const supabaseAdmin = getAdminCortex();
    const supabaseClient = await getDbCortex();

    // 1. SECURITY CORTEX: Double-verify God Mode
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new BrainError("No active session found", ErrorSource.AUTH, 401);

    const { data: profile } = await supabaseClient.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'owner') {
        throw new BrainError("SECURITY VIOLATION: Only the Vault Owner can execute the Purge Protocol.", ErrorSource.AUTH, 403);
    }

    // 2. PURGE MOCK USERS (Only deletes users with the fake domain)
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    if (userList?.users) {
        for (const u of userList.users) {
            if (u.email?.endsWith('@collector.net')) {
                await supabaseAdmin.auth.admin.deleteUser(u.id); // Deletes from Auth AND cascades to Profiles
            }
        }
    }

    // 3. PURGE PRODUCTS & IMAGES
    const { data: files } = await supabaseAdmin.storage.from('vault-assets').list('products');
    if (files && files.length > 0) {
        const filePaths = files.map(x => `products/${x.name}`);
        await supabaseAdmin.storage.from('vault-assets').remove(filePaths);
    }

    const { error: dbError } = await supabaseAdmin.from('products').delete().not('id', 'is', null);
    if (dbError) throw new BrainError("Failed to purge products table.", ErrorSource.DATABASE, 500, dbError);

    return { message: "Vault inventory and mock users successfully purged." };
}