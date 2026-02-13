import { AddToCart } from "@/components/add-to-cart";
import { getCartItems } from "@/lib/services/cart";
import { getProduct } from "@/lib/services/product";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await getProduct(Number(id));
  const cartItems = await getCartItems();

  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id == productId);
  };

  if (!product) {
    redirect("/products");
  }

  const formattedPrice = (product.price / 100).toLocaleString("es-ar", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver a productos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sección de Imagen */}
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-4 flex items-center justify-center relative aspect-square">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="text-6xl">📦</div>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                Últimas unidades
              </span>
            )}
          </div>

          {/* Sección de Detalles */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3">
                {product.name}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-8">
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? `En stock: ${product.stock}` : "Agotado"}
                </span>
              </div>
            </div>

            <div className="mt-auto border-t pt-6 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  {formattedPrice}
                </span>
              </div>
              <AddToCart
                productId={product.id}
                stock={product.stock}
                isInCart={isProductInCart(product.id)}
              />
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-6">
                <span>SKU: {product.id}</span>
                <span>·</span>
                <span>
                  Publicado:{" "}
                  {new Date(product.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
