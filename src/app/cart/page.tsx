"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCreditCard,
} from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";

type CartItem = {
  id: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    quantity: number;
    stock: number;
  };
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cart/items");
        if (!response.ok)
          throw new Error("Error al cargar los productos del carrito");
        const data = await response.json();
        console.log(data);
        setCartItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Calcular totales
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  // Actualizar cantidad
  const updateQuantity = async (id: number, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    if (newQuantity > item.product.stock) {
      alert(`Solo hay ${item.product.stock} unidades disponibles`);
      return;
    }

    setUpdatingItem(id);
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Eliminar item
  const removeItem = async (itemId: number) => {
    if (!confirm("¿Deseas eliminar este producto del carrito?")) return;
    setLoading(true);
    try {
      await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
    setLoading(false);
  };

  // Vaciar carrito
  const clearCart = async () => {
    if (!confirm("¿Deseas vaciar todo el carrito?")) return;
    setLoading(true);
    try {
      await fetch("/api/cart/items", { method: "DELETE" });
      setCartItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
    setLoading(false);
  };

  if (loading && cartItems.length === 0) {
    return (
      <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <FiShoppingCart className="mx-auto text-6xl text-gray-400 mb-4 animate-pulse" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Cargando carrito...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            Carrito de Compras
          </h1>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 transition">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition">
              Productos
            </Link>
            <span>/</span>
            <span>Carrito</span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Carrito vacío
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-12 text-center">
            <FiShoppingCart className="mx-auto text-8xl text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition duration-200 font-semibold"
            >
              <FiPackage />
              Ver productos
            </Link>
          </div>
        ) : (
          // Carrito con productos
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiPackage className="text-blue-600" />
                    Productos ({cartItems.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold transition duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg"
                    disabled={loading}
                  >
                    <FiTrash2 />
                    Vaciar carrito
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition duration-200"
                    >
                      {/* Imagen */}
                      <Link
                        href={`/products/${item.product.id}`}
                        className="w-full sm:w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden relative group"
                      >
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <FiPackage className="text-5xl text-gray-400" />
                        )}
                      </Link>

                      {/* Información del producto */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-bold text-lg hover:text-blue-600 transition line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase mt-1">
                            {item.product.category}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {item.product.stock > 0 ? (
                              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                <IoCheckmarkCircle />
                                {item.product.stock} en stock
                              </span>
                            ) : (
                              <span className="text-sm text-red-600">
                                Sin stock
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={updatingItem === item.id}
                              className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50"
                            >
                              <FiMinus />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number(e.target.value))
                              }
                              className="input w-16 text-center font-semibold"
                              disabled={updatingItem === item.id}
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updatingItem === item.id}
                              className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50"
                            >
                              <FiPlus />
                            </button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">
                              {(
                                Number(item.unitPrice) * item.quantity
                              ).toLocaleString("es-ar", {
                                style: "currency",
                                currency: "ARS",
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Number(item.unitPrice).toLocaleString("es-ar", {
                                style: "currency",
                                currency: "ARS",
                                minimumFractionDigits: 2,
                              })}{" "}
                              c/u
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 self-start sm:self-center transition duration-200 w-9 h-9 rounded-lg flex items-center justify-center"
                        title="Eliminar producto"
                        disabled={loading}
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continuar comprando */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition duration-200 hover:gap-3"
                  >
                    <FiArrowLeft />
                    Continuar comprando
                  </Link>
                </div>
              </div>
            </div>

            {/* Resumen de compra */}
            <div className="lg:col-span-1">
              <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold mb-6">Resumen de compra</h2>

                {/* Desglose de precios */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      {subtotal.toLocaleString("es-ar", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiTruck />
                      Envío
                    </span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <IoCheckmarkCircle />
                          Gratis
                        </span>
                      ) : (
                        shipping.toLocaleString("es-ar", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                        })
                      )}
                    </span>
                  </div>

                  {subtotal < 50000 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                        <FiTruck className="mt-0.5 flex-shrink-0" />
                        <span>
                          Compra{" "}
                          <strong>
                            {(50000 - subtotal).toLocaleString("es-ar", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 2,
                            })}
                          </strong>{" "}
                          más para envío gratis
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-blue-600 text-2xl">
                    {total.toLocaleString("es-ar", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Botón de checkout */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 mb-3"
                  disabled={loading}
                  onClick={() =>
                    alert(
                      "Pedido generado (Plataforma de pago no implementada)"
                    )
                  }
                >
                  <FiCreditCard />
                  Proceder al pago
                </button>

                {/* Badges de confianza */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <IoCheckmarkCircle className="text-green-600" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <IoCheckmarkCircle className="text-green-600" />
                    <span>Garantía de devolución</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <IoCheckmarkCircle className="text-green-600" />
                    <span>Envío rápido y seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
