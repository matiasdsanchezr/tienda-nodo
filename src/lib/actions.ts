"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { addToCart } from "@/lib/services/cart";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function addToCartAction(
  prevState: ActionState,
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
