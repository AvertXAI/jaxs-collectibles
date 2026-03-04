import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// We create a special "Admin" client with write access
const adminClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-03-01",
    token: process.env.SANITY_API_TOKEN, // Make sure this is in your Vercel & .env.local
    useCdn: false,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // This creates the document in Sanity
        const result = await adminClient.create({
            _type: "product",
            name: body.name,
            slug: { _type: "slug", current: body.name.toLowerCase().replace(/\s+/g, "-") },
            itemNumber: body.itemNumber,
            category: body.category,
            description: body.description,
            price: parseFloat(body.price),
            stock: parseInt(body.stock),
            notes: body.notes,
            // Note: Images handle differently, we can set that up next
        });

        return NextResponse.json({ success: true, id: result._id });
    } catch (error) {
        console.error("Sanity Create Error:", error);
        return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 });
    }
}