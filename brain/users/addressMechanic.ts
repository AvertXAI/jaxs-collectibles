//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use server'

import { getDbCortex } from '@/brain/db/cortex'
import { BrainError, ErrorSource } from '@/brain/errors'

export async function getUserAddresses() {
    const supabase = await getDbCortex()

    try {
        // 1. Verify User Session
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new BrainError("Unauthorized", ErrorSource.AUTH, 401)

        // 2. Fetch Addresses (Joining tax_rates just in case we need the raw rate later)
        const { data, error } = await supabase
            .from('addresses')
            .select('*, tax_rates(tax_rate)')
            .eq('customer_id', user.id)
            .order('is_default', { ascending: false })

        if (error) throw error
        return data || []
    } catch (err: any) {
        throw new BrainError('ADDRESS_FETCH_FAILED', ErrorSource.DATABASE, 500, err)
    }
}

export async function addAddress(addressData: {
    full_name: string,
    street_address: string,
    city: string,
    state_code: string,
    postal_code: string,
    is_default?: boolean
}) {
    const supabase = await getDbCortex()

    try {
        // 1. Verify User Session
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new BrainError("Unauthorized", ErrorSource.AUTH, 401)

        // 2. Insert New Address
        const { data, error } = await supabase
            .from('addresses')
            .insert([{ ...addressData, customer_id: user.id }])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (err: any) {
        throw new BrainError('ADDRESS_INSERT_FAILED', ErrorSource.DATABASE, 500, err)
    }
}