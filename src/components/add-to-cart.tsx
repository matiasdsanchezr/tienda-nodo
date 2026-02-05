"use client";
import { useActionState } from "react";
import { addToCartAction } from "@/lib/actions"; // Importa tu server action

interface AddToCartProps {
  productId: number;
  stock: number;
  initialInCart: boolean;
}

export function AddToCart({ productId, stock, initialInCart }: AddToCartProps) {
  const [state, formAction, isPending] = useActionState(addToCartAction, null);

  const isOutOfStock = stock === 0;
  const isInCart = initialInCart || state?.success;

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
      >
        Sin stock
      </button>
    );
  }

  if (isInCart) {
    return (
      <button
        disabled
        className="w-full bg-green-600 text-white py-2 px-4 rounded cursor-not-allowed"
      >
        ✓ En carrito
      </button>
    );
  }

  return (
    <form action={formAction.bind(null, productId)}>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200 font-semibold disabled:opacity-70"
      >
        {isPending ? "Agregando..." : "Agregar al carrito"}
      </button>
      {state?.message && !state.success && (
        <p className="text-red-500 text-sm mt-2">{state.message}</p>
      )}
    </form>
  );
}
