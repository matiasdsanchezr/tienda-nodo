"use server";
import { getProducts } from "@/lib/services/product";
import { ProductList } from "../_components/product-list";

const AdminProductsPage = async () => {
  const allProducts = await getProducts();

  return <ProductList allProducts={allProducts} />;
};

export default AdminProductsPage;
