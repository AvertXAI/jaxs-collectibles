import { Suspense } from "react";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string }>;
};

// 1. This is the "Dynamic" part that fetches the data
async function ProductDetails({ slug }: { slug: string }) {
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

    if (!product) return <div className="p-4">Product not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                {product.images && product.images.map((image: string, index: number) => (
                    <Image key={index} src={image} alt={product.name} width={500} height={500} className="w-full h-auto object-cover mb-4" />
                ))}
            </div>
            <div>
                <p className="text-gray-500">${product.price}</p>
                <div className="mt-4">{product.description}</div>
                <p className="mt-4">Stock: {product.stock}</p>
            </div>
        </div>
    );
}

// 2. This is the "Static Shell" that Vercel builds
export default async function Page({ params }: Props) {
    const { slug } = await params;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Product Details</h1>
            {/* 3. The Suspense boundary fixes the build error */}
            <Suspense fallback={<div className="animate-pulse">Loading your collectible...</div>}>
                <ProductDetails slug={slug} />
            </Suspense>
        </div>
    );
}