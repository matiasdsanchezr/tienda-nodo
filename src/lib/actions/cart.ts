"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "../auth";
import { addToCart } from "../services/cart";
import { ActionResponse } from "./action-state";

export async function clearCartAction() {
  try {
    // if (!response.ok) {
    //   throw new Error("Error al vaciar el carrito");
    // }

    // Revalida la página para reflejar los cambios
    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al vaciar el carrito" };
  }
}

export async function addToCartAction(
  prevState: ActionResponse,
  productId: number
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Debes iniciar sesión" };
    }

    await addToCart({
      userId: session.user.id,
      productId: productId,
      quantity: 1,
    });

    revalidatePath("/products", "page");

    return { success: true, message: "Producto agregado" };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return { success: false, message: "Producto no encontrado." };
      }
      if (error.message === "INSUFFICIENT_STOCK") {
        return {
          success: false,
          message: "Lo sentimos, no hay suficiente stock.",
        };
      }
    }
    return {
      success: false,
      message: "Ocurrió un error al agregar el producto.",
    };
  }
}
