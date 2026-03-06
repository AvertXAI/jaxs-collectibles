import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/client'

// --- PATCH: UPDATE PRODUCT DETAILS ---
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const body = await request.json()

    try {
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

        const result = await adminClient
            .patch(id)
            .set({
                name: body.name,
                price: body.price,
                category: body.category
            })
            .commit()

        return NextResponse.json({ message: "Asset refined in the Vault", result })
    } catch (error) {
        console.error('Update Error:', error)
        return NextResponse.json({ error: "Failed to refine asset" }, { status: 500 })
    }
}

// --- DELETE: PURGE PRODUCT ---
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    try {
        await adminClient.delete(id)
        return NextResponse.json({ message: `Asset ${id} successfully purged` })
    } catch (error) {
        return NextResponse.json({ error: "Purge failed" }, { status: 500 })
    }
}