import ProductsClient from "./_components/products-client";
import { getProducts } from "@/lib/services/product";
import { getCartItems } from "@/lib/services/cart";

export default async function ProductsPage() {
  const [products, cartProductIds] = await Promise.all([
    getProducts(),
    getCartItems(),
  ]);

  return <ProductsClient products={products} cartProductIds={cartProductIds} />;
}
