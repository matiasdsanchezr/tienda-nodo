"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { FaTshirt } from "react-icons/fa";
import { FiActivity, FiHome, FiSmartphone } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi2";
import { MdErrorOutline } from "react-icons/md";

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode; // Ahora usamos componentes React en lugar de emojis
};

const HomePage = () => {
  const session = authClient.useSession().data;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Error al cargar los productos");
        const data = await response.json();
        setAllProducts(data.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories: Category[] = [
    {
      id: "Electrónica",
      name: "Electrónica",
      icon: <FiSmartphone className="w-10 h-10" />,
    },
    {
      id: "Hogar",
      name: "Hogar",
      icon: <FiHome className="w-10 h-10" />,
    },
    {
      id: "Deportes",
      name: "Deportes",
      icon: <FiActivity className="w-10 h-10" />,
    },
    {
      id: "Moda",
      name: "Moda",
      icon: <FaTshirt className="w-10 h-10" />,
    },
  ];

  const filteredProducts = allProducts;

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bienvenido a Nuestra Tienda
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Encuentra los mejores productos al mejor precio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
              >
                Ver Productos
                <HiArrowRight className="w-5 h-5" />
              </Link>
              {!session?.user && (
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 py-3 px-8 rounded-lg font-semibold transition duration-200"
                >
                  Registrarse
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Explora por Categoría
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="bg-bg-secondary dark:bg-dark-bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center group hover:scale-105"
            >
              <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold group-hover:text-blue-600 transition duration-200">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4 py-16 bg-bg-secondary dark:bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Productos Destacados
          </h2>

          {/* Estado de Loading con icono animado */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AiOutlineLoading3Quarters className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Cargando productos...
              </p>
            </div>
          )}

          {/* Estado de Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-red-600">
              <MdErrorOutline className="w-16 h-16 mb-4" />
              <p className="text-lg font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid de Productos */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 group hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BiPackage className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-lg mt-2 mb-3 line-clamp-2 group-hover:text-blue-600 transition duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {parseFloat(product.price).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <BiPackage className="w-20 h-20 mb-4 opacity-50" />
              <p className="text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!session?.user && (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl p-8 md:p-12 text-center border border-blue-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para comenzar a comprar?
            </h2>
            <p className="text-lg mb-8 opacity-80">
              Regístrate ahora y reserva tu pedido
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
              >
                Crear Cuenta
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white py-3 px-8 rounded-lg font-semibold transition duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default HomePage;
