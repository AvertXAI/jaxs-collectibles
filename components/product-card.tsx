import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    images: string[];
    price: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <Link href={`/products/${product.slug.current}`}>
        <div>
          {product.images && product.images[0] && (
            <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover mb-4" />
          )}
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-gray-500">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}
