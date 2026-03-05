import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const adminClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-03-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // 1. Grab the image file from the request
        const file = formData.get("image") as File;
        let imageAsset;

        if (file) {
            // 2. Upload the file to Sanity first to get an Asset ID
            imageAsset = await adminClient.assets.upload("image", file, {
                filename: file.name,
            });
        }

        // 3. Create the actual Product document
        const result = await adminClient.create({
            _type: "product",
            name: formData.get("name") as string,
            slug: {
                _type: "slug",
                current: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-")
            },
            itemNumber: formData.get("itemNumber") as string,
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string) || 0,
            stock: parseInt(formData.get("stock") as string) || 1,
            notes: formData.get("notes") as string,
            tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()) || [],
            // Link the image we just uploaded
            images: imageAsset ? [{
                _key: Math.random().toString(36).substring(2),
                _type: "image",
                asset: { _ref: imageAsset._id }
            }] : [],
        });

        return NextResponse.json({ success: true, id: result._id });
    } catch (error) {
        console.error("Sanity Upload Error:", error);
        return NextResponse.json({ success: false, error: "Failed to upload to Vault" }, { status: 500 });
    }
}