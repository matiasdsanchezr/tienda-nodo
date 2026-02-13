"use client";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

export const ClearCart = () => {
  const router = useRouter();
  const clearCart = async () => {
    if (!confirm("¿Deseas vaciar todo el carrito?")) return;
    try {
      const res = await fetch("/api/cart/items", { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Error al vaciar el carrito");
        alert("Hubo un error al vaciar el carrito.");
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Error desconocido");
      alert("Hubo un error al vaciar el carrito.");
    }
  };

  return (
    <button
      onClick={clearCart}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold transition duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg"
    >
      <FiTrash2 />
      Vaciar carrito
    </button>
  );
};
