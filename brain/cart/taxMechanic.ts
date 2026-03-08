//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use server'

import { getDbCortex } from '@/brain/db/cortex'
import { BrainError, ErrorSource } from '@/brain/errors'

export async function fetchTaxRate(stateCode: string): Promise<number> {
    const supabase = await getDbCortex()

    try {
        const { data, error } = await supabase
            .from('tax_rates')
            .select('tax_rate')
            .eq('state_code', stateCode.toUpperCase())
            .single()

        // If the state isn't found, default to 0 to prevent checkout crashes
        if (error || !data) {
            console.warn(`[TAX_CORTEX] State ${stateCode} not found. Defaulting to 0% tax.`)
            return 0;
        }

        return data.tax_rate;
    } catch (err: any) {
        throw new BrainError('TAX_RATE_FETCH_FAILED', ErrorSource.DATABASE, 500, err)
    }
}