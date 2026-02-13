"use client";
import { AddToCart } from "@/components/add-to-cart";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsClientProps {
  products: Product[];
  cartProductIds: {
    id: string;
    product: {
      id: number;
      name: string;
      description: string;
      image: string;
      category: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    cartId: string;
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

const categories = ["Todas", "Electrónica", "Hogar", "Deportes", "Moda"];

export default function ProductsClient({
  products,
  cartProductIds,
}: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;
  const cartSet = useMemo(
    () => new Set(cartProductIds.map((item) => item.product.id)),
    [cartProductIds]
  );

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todas" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Paginación
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );
  }, [filteredAndSortedProducts, currentPage]);

  // Reset página cuando cambian filtros
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Todos los Productos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre nuestra amplia selección de productos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) =>
                  handleFilterChange(() => setSearchTerm(e.target.value))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Categoría</label>
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) =>
                  handleFilterChange(() => setSelectedCategory(e.target.value))
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Ordenar por</label>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-sm font-semibold">
                {filteredAndSortedProducts.length} producto
                {filteredAndSortedProducts.length !== 1 ? "s" : ""} encontrado
                {filteredAndSortedProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Filtros activos */}
          {(selectedCategory !== "Todas" || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-semibold">Filtros activos:</span>
              {selectedCategory !== "Todas" && (
                <button
                  onClick={() =>
                    handleFilterChange(() => setSelectedCategory("Todas"))
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-200"
                >
                  {selectedCategory} ✕
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => handleFilterChange(() => setSearchTerm(""))}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-200"
                >
                  &quot;{searchTerm}&quot; ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grid de Productos */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200 group hover:scale-105"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover"
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
                      isInCart={cartSet.has(product.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`button px-4 py-2 rounded transition duration-200 ${
                    currentPage === 1
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  ← Anterior
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`button px-4 py-2 rounded transition duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`button px-4 py-2 rounded transition duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Intenta ajustar tus filtros o búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todas");
                setSortBy("name-asc");
                setCurrentPage(1);
              }}
              className="button bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
