import { Suspense } from "react";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from "next/image";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
};

async function ProductContent({ slug }: { slug: string }) {
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
    );

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product) return <div className="p-4 text-white">Asset not found in the Vault.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#1B263B]">
            <div className="space-y-4">
                {/* Fallback logic for old image_url vs new images array */}
                {(product.images?.length > 0 ? product.images : [product.image_url]).map((image: string, index: number) => (
                    image && (
                        <div key={index} className="relative aspect-square w-full">
                            <Image
                                src={image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-2xl shadow-2xl object-cover"
                            />
                        </div>
                    )
                ))}
            </div>
            <div className="p-4">
                <h1 className="text-5xl font-black italic tracking-tighter text-[#590202] uppercase mb-4">{product.name}</h1>
                <p className="text-3xl font-black text-emerald-600 mb-6">${product.price}</p>
                <div className="prose prose-slate max-w-none text-lg leading-relaxed">
                    {product.description}
                </div>
                <div className="mt-10 p-6 bg-white rounded-2xl border border-[#D9B36C]/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Status</p>
                    <p className="text-xl font-bold">{product.stock > 0 ? `${product.stock} Units Secured` : 'Sold Out'}</p>
                </div>
            </div>
        </div>
    );
}

export default async function Page({ params }: Props) {
    const { slug } = await params;

    return (
        <main className="min-h-screen bg-[#F2EFDF] p-8 md:p-20">
            <Suspense fallback={<div className="text-[#1B263B] font-black animate-pulse">RETRIVING ASSET DATA...</div>}>
                <ProductContent slug={slug} />
            </Suspense>
        </main>
    );
}