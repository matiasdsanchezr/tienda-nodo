"use client";
import { addToCartAction } from "@/lib/actions/cart";
import { useActionState } from "react";

interface AddToCartProps {
  productId: number;
  stock: number;
  isInCart: boolean;
}

export function AddToCart({ productId, stock, isInCart }: AddToCartProps) {
  const [state, formAction, isPending] = useActionState(addToCartAction, {
    message: "",
    success: false,
  });

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
      >
        Sin stock
      </button>
    );
  }

  if (isInCart || state?.success) {
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
