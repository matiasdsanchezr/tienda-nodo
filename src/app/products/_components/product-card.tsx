// app/products/product-card.tsx (Server Component)
import { AddToCart } from "@/components/add-to-cart";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    stock: number;
  };
  isInCart: boolean;
}

export default function ProductCard({ product, isInCart }: ProductCardProps) {
  return (
    <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200 group hover:scale-105">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-100"
              />
            ) : (
              "📦"
            )}
          </div>
          {product.stock === 0 ? (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Sin stock
            </span>
          ) : product.stock < 10 ? (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              ¡Últimas unidades!
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
            {product.category}
          </span>
          <h3 className="font-bold text-lg mt-2 mb-1 group-hover:text-blue-600 transition duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm text-gray-500">
              ({product.stock} en stock)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {(product.price / 100).toLocaleString("es-ar", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <AddToCart
          productId={product.id}
          stock={product.stock}
          isInCart={isInCart}
        />
      </div>
    </div>
  );
}
