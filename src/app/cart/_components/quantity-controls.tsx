"use client";
import { getCartItems } from "@/lib/services/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

type QuantityControlsProps = {
  cartItems: Awaited<ReturnType<typeof getCartItems>>;
  item: Awaited<ReturnType<typeof getCartItems>>[number];
};

export const QuantityControls = ({
  cartItems,
  item,
}: QuantityControlsProps) => {
  const router = useRouter();
  const [updatingItem, setUpdatingItem] = useState<boolean>(false);

  // Eliminar item
  const removeItem = async (itemId: string) => {
    if (!confirm("¿Deseas eliminar este producto del carrito?")) return;
    setUpdatingItem(true);
    try {
      await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Error desconocido");
    }
    setUpdatingItem(false);
  };

  // Actualizar cantidad
  const updateQuantity = async (id: string, newQuantity: number) => {
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

    setUpdatingItem(true);
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      router.refresh();
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUpdatingItem(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={updatingItem}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50"
      >
        <FiMinus />
      </button>
      <input
        type="number"
        min="1"
        max={item.product.stock}
        value={item.quantity}
        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
        className="input w-16 text-center font-semibold"
        disabled={updatingItem}
        readOnly
      />
      <button
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        disabled={updatingItem}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50"
      >
        <FiPlus />
      </button>
    </div>
  );
};
