import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

// 1. UPDATE: In Next.js 15, params must be a Promise in the type
type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function Page({ params }: Props) {
    // 2. UPDATE: You MUST await the params before using params.slug
    const { slug } = await params;

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
        { slug: slug } // 3. Use the awaited slug here
    );

    // Keep all your UI code exactly as it was
    if (!product) return <div className="p-4">Product not found</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
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
        </div>
    );
}