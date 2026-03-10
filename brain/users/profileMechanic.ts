//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: brain/users/profileMechanic.ts
//////////////////////////////////////////////////
'use server'

import { getDbCortex } from '../db/cortex'
import { BrainError, ErrorSource } from '../errors'

export async function updateProfileIntelligence(formData: {
    firstName: string,
    lastName: string,
    phone: string
}) {
    const supabase = await getDbCortex()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                updated_at: new Date().toISOString() // Put back exactly as you requested
            })
            .eq('id', user.id)

        if (error) {
            console.error("\n[CORTEX_DB_REJECT]:", error.message, error.details);
            throw error;
        }

        return { success: true }
    } catch (err: any) {
        throw new BrainError("PROFILE_SYNC_FAILED", ErrorSource.DATABASE, 500, err)
    }
}