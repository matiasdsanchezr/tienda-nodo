"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating";

export interface Product {
  name: string;
  id: number;
  description: string;
  image: string;
  category: string;
  price: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
    stock: number;
  };
};

const categories = ["Todas", "Electrónica", "Hogar", "Deportes", "Moda"];

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "Todas"
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "name-asc"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const productsPerPage = 12;

  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    if (name !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Fetch productos y carrito al cargar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch productos
        const productsResponse = await fetch("/api/products");
        if (!productsResponse.ok)
          throw new Error("Error al cargar los productos");
        const productsData = await productsResponse.json();
        setAllProducts(productsData);

        // Fetch carrito
        const cartResponse = await fetch("/api/cart/items");
        if (!cartResponse.ok) throw new Error("Error al cargar el carrito");
        const cartData = await cartResponse.json();
        setCartItems(cartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "Todas");
    setSearchTerm(searchParams.get("search") || "");
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Verificar si un producto está en el carrito
  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  // Verificar el estado del botón
  const getButtonState = (product: Product) => {
    if (product.stock === 0) {
      return {
        disabled: true,
        text: "Sin stock",
        className: "bg-gray-400 cursor-not-allowed",
      };
    }
    if (isProductInCart(product.id)) {
      return {
        disabled: true,
        text: "En carrito",
        className: "bg-green-600 cursor-not-allowed",
      };
    }
    return {
      disabled: false,
      text: "Agregar",
      className: "bg-blue-600 hover:bg-blue-700",
    };
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todas" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, allProducts]);

  // Paginación
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / productsPerPage
  );
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Resetear a página 1 cuando cambian filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Agregar al carrito
  const handleAddCartItem = async (productId: number) => {
    try {
      setAddingToCart(productId);
      const response = await fetch(`/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }

      // Actualizar el estado del carrito
      const cartResponse = await fetch("/api/cart/items");
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      alert("No se pudo agregar el producto al carrito");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Todos los Productos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre nuestra amplia selección de productos
          </p>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Input de Búsqueda */}
            <div className="md:col-span-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateUrl("search", e.target.value);
                }}
              />
            </div>

            {/* Filtro por categoría */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Categoría</label>
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  updateUrl("category", val);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Ordenar por</label>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  updateUrl("sort", e.target.value);
                }}
              >
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
                <option value="rating">Mejor Valorados</option>
              </select>
            </div>

            {/* Resultados */}
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
                  onClick={() => {
                    setSelectedCategory("Todas");
                    updateUrl("category", "");
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-200"
                >
                  {selectedCategory} ✕
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleFilterChange();
                  }}
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
              {paginatedProducts.map((product) => {
                const buttonState = getButtonState(product);
                return (
                  <div
                    key={product.id}
                    className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200 group hover:scale-105"
                  >
                    <Link href={`/products/${product.id}`}>
                      {/* Imagen del producto */}
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt=""
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

                      {/* Información del producto */}
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

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <span className="text-sm text-gray-500">
                            ({product.stock} en stock)
                          </span>
                        </div>

                        {/* Precio y botón */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            {parseFloat(product.price).toLocaleString("es-ar", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!buttonState.disabled) {
                            handleAddCartItem(product.id);
                          }
                        }}
                        className={`button w-full ${buttonState.className} text-white py-2 px-4 rounded transition duration-200 text-sm font-semibold`}
                        disabled={
                          buttonState.disabled || addingToCart === product.id
                        }
                      >
                        {addingToCart === product.id
                          ? "Agregando..."
                          : buttonState.text}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
          // Estado vacío
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
};

export default ProductsPage;
