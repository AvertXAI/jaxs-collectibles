//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import Image from 'next/image'
import Link from 'next/link'
import ProductStatus from './product-status'

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#D9B36C]/10 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(89,2,2,0.1)] hover:-translate-y-2">
      {/* Visual Container */}
      <div className="relative aspect-[4/5] bg-[#F2EFDF]/50 flex items-center justify-center overflow-hidden">
        {/* Prism Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <ProductStatus status={product.availability} />
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 right-4 bg-[#590202] text-[#F2EFDF] px-3 py-1 rounded-lg font-black text-sm shadow-lg z-10">
          ${product.price?.toLocaleString()}
        </div>

        {/* Image or Category Placeholder */}
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="text-[#D9B36C]/30 font-black uppercase tracking-tighter text-4xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
            {product.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D9B36C]">
            {product.brand || product.category || "Authentic Item"}
          </p>
        </div>

        <h3 className="text-[#1B263B] font-bold text-lg mb-6 line-clamp-2 leading-tight h-12">
          {product.name}
        </h3>

        <Link
          href={`/products/${product.slug}`}
          className="block w-full text-center py-4 bg-[#1B263B] text-[#F2EFDF] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-[#590202] active:scale-95 shadow-md"
        >
          Inspect Item
        </Link>
      </div>
    </div>
  );
}