import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                },
            },
        }
    )

    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;
        let publicUrl = "";

        // 1. UPLOAD TO SUPABASE STORAGE
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('vault-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. GET PUBLIC URL
            const { data: urlData } = supabase.storage
                .from('vault-assets')
                .getPublicUrl(filePath);

            publicUrl = urlData.publicUrl;
        }

        // 3. INSERT INTO POSTGRESQL
        const name = formData.get("name") as string;
        const slug = name.toLowerCase().replace(/\s+/g, "-");

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: name,
                slug: slug,
                item_number: formData.get("itemNumber"),
                category: formData.get("category"), // Matches your current text column
                description: formData.get("description"),
                price: parseFloat(formData.get("price") as string) || 0,
                stock: parseInt(formData.get("stock") as string) || 0,
                notes: formData.get("notes"),
                tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()) || [],
                images: publicUrl ? [publicUrl] : [], // Array for future multiple images
                coa: { verified: true, id: "", authenticator: "" } // Default COA object
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, id: data.id });
    } catch (error: any) {
        console.error("Vault Upload Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}