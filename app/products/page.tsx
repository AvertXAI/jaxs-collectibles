import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/product-card";
import InventoryGrid from "@/components/inventory-grid";

export default async function ProductsPage() {
    const products = await client.fetch(
      groq`*[_type == "product"]{
        _id,
        name,
        slug,
        description,
        "images": images[].asset->url,
        price,
        stock,
      }`
    );

    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-black italic mb-10 tracking-tighter">ALL COLLECTIBLES</h1>
          <InventoryGrid />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      </main>
    );
  }
