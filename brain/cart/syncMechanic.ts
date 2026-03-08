//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
'use server'

import { getDbCortex } from '@/brain/db/cortex'
import { BrainError, ErrorSource } from '@/brain/errors'

export const syncMechanic = {
    /**
     * Fetches the full cart for a specific customer
     */
    async getCart(customerId: string) {
        const supabase = await getDbCortex()
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*, products(*)')
                .eq('customer_id', customerId)

            if (error) throw error
            return data || []
        } catch (err: any) {
            throw new BrainError('CORTEX_CART_FETCH_FAILED', ErrorSource.DATABASE, 500, err)
        }
    },

    /**
     * Upserts an item into the cart.
     */
    async upsertItem(customerId: string, productId: string, quantity: number) {
        const supabase = await getDbCortex()
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .upsert(
                    { customer_id: customerId, product_id: productId, quantity: quantity },
                    { onConflict: 'customer_id, product_id' }
                )
                .select()
                .single()

            if (error) throw error
            return data
        } catch (err: any) {
            throw new BrainError('CORTEX_CART_UPSERT_FAILED', ErrorSource.DATABASE, 500, err)
        }
    },

    /**
     * Purges a specific item from the cart entirely.
     */
    async removeItem(customerId: string, productId: string) {
        const supabase = await getDbCortex()
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .match({ customer_id: customerId, product_id: productId })

            if (error) throw error
            return true
        } catch (err: any) {
            throw new BrainError('CORTEX_CART_REMOVE_FAILED', ErrorSource.DATABASE, 500, err)
        }
    },

    /**
     * Wipes the entire cart for a user (Triggered after successful Checkout)
     */
    async clearCart(customerId: string) {
        const supabase = await getDbCortex()
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .match({ customer_id: customerId })

            if (error) throw error
            return true
        } catch (err: any) {
            throw new BrainError('CORTEX_CART_CLEAR_FAILED', ErrorSource.DATABASE, 500, err)
        }
    }
}