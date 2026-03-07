import { Suspense } from "react";
import { groq } from "next-sanity";
import { client } from "@/_sanity_archive/lib/client";
import Image from "next/image";

// Force Next.js to treat this as a dynamic route
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. Separate the Data Fetching logic
async function ProductContent({ slug }: { slug: string }) {
    const product = await client.fetch(
        groq`*[_type == "product" && slug.current == $slug][0]{
            _id,
            name,
            slug,
            description,
            "images": images[].asset->url,
            price,
            stock,
        }`,
        { slug }
    );

    if (!product) return <div className="p-4 text-white">Product not found.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div>
                {product.images && product.images.map((image: string, index: number) => (
                    <Image key={index} src={image} alt={product.name} width={600} height={600} className="rounded-lg shadow-xl" />
                ))}
            </div>
            <div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-2xl text-green-400 mb-4">${product.price}</p>
                <div className="prose prose-invert">{product.description}</div>
                <p className="mt-4 text-gray-400">Inventory: {product.stock} available</p>
            </div>
        </div>
    );
}

// 2. Main Page Component (The "Shell")
export default async function Page({ params }: Props) {
    const { slug } = await params;

    return (
        <main className="min-h-screen bg-black p-8">
            {/* The Suspense Boundary is what fixes the "Uncached data" error */}
            <Suspense fallback={<div className="text-white animate-pulse">Loading Jax's Collectibles...</div>}>
                <ProductContent slug={slug} />
            </Suspense>
        </main>
    );
}