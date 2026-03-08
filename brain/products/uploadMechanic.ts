import { getDbCortex } from '../db/cortex';
import { BrainError, ErrorSource } from '../errors';

export async function executeProductUpload(formData: FormData) {
    const supabase = await getDbCortex();
    const file = formData.get("image") as File;
    let publicUrl = "";

    // 1. STORAGE CORTEX: Handle Image Upload
    if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('vault-assets')
            .upload(filePath, file);

        if (uploadError) {
            throw new BrainError("Failed to secure image in Vault Storage", ErrorSource.STORAGE, 502, uploadError);
        }

        const { data: urlData } = supabase.storage
            .from('vault-assets')
            .getPublicUrl(filePath);

        publicUrl = urlData.publicUrl;
    }

    // 2. VALIDATION CORTEX: Check required fields
    const name = formData.get("name") as string;
    if (!name) throw new BrainError("Asset Name is strictly required", ErrorSource.VALIDATION, 400);

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const price = parseFloat(formData.get("price") as string) || 0;
    const stock = parseInt(formData.get("stock") as string) || 0;

    // 3. DATABASE CORTEX: Insert Record
    const { data, error: dbError } = await supabase
        .from('products')
        .insert([{
            name,
            slug,
            item_number: formData.get("itemNumber"),
            category: formData.get("category"),
            description: formData.get("description"),
            price,
            stock,
            notes: formData.get("notes"),
            tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()) || [],
            images: publicUrl ? [publicUrl] : [],
            coa: { verified: true, id: "", authenticator: "" }
        }])
        .select()
        .single();

    if (dbError) {
        throw new BrainError("Failed to write asset metadata to PostgreSQL", ErrorSource.DATABASE, 500, dbError);
    }

    return { id: data.id, name: data.name };
}