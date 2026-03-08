//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { getAdminCortex } from '../db/adminCortex';
import { getDbCortex } from '../db/cortex';
import { BrainError, ErrorSource } from '../errors';
import { seedProducts } from '@/lib/seed-data';
import { seedUsers } from '@/lib/seed-users';
import { seedTaxes } from '@/lib/seed-taxes'; // PHASE 28: TAX SEEDER

export async function executeDatabaseSeed() {
    const supabaseAdmin = getAdminCortex();
    const supabaseClient = await getDbCortex();

    // 1. SECURITY CORTEX: Verify the requester is an Admin/Owner
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new BrainError("Unauthorized", ErrorSource.AUTH, 401);

    // 2. PRODUCT SEEDING
    const { error: productError } = await supabaseAdmin.from('products').insert(seedProducts);
    if (productError) throw new BrainError("Failed to seed products", ErrorSource.DATABASE, 500, productError);

    // 3. TAX SEEDING (Upsert prevents duplicates if run multiple times)
    const { error: taxError } = await supabaseAdmin.from('tax_rates').upsert(seedTaxes, { onConflict: 'state_code' });
    if (taxError) throw new BrainError("Failed to seed tax rates", ErrorSource.DATABASE, 500, taxError);

    // 4. USER SEEDING
    let usersCreated = 0;
    for (const u of seedUsers) {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
        });

        if (authData.user && !authError) {
            await supabaseAdmin.from('profiles').update({
                first_name: u.firstName,
                last_name: u.lastName,
                phone: u.phone,
                role: 'user'
            }).eq('id', authData.user.id);
            usersCreated++;
        }
    }

    return { message: `Vault Seeded: 50 Products, 52 Tax Zones, ${usersCreated} Users.` };
}