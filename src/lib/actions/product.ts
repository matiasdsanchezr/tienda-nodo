"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod/v4";
import { auth } from "../auth";
import {
  createProduct,
  deleteProduct,
  patchProduct,
} from "../services/product";
import {
  ProductDeleteSchema,
  ProductPatchSchema,
} from "../validations/product";
import { ActionResponse } from "./action-state";

export async function createProductAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, message: "Debes iniciar sesión" };
    }

    const data = Object.fromEntries(formData);
    const validation = ProductPatchSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Los datos de la petición son invalidos",
        errors: z.treeifyError(validation.error).errors,
      };
    }

    const product = await createProduct(validation.data);
    revalidatePath("/products", "page");
    return { success: true, message: "Producto agregado", data: product };
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

export async function deleteProductAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, message: "Debes iniciar sesión" };
    }

    const data = Object.fromEntries(formData);
    const validation = ProductDeleteSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Los datos de la petición son invalidos",
        errors: JSON.stringify(z.treeifyError(validation.error)),
      };
    }

    const product = await deleteProduct(validation.data.id);
    revalidatePath("/products", "page");
    return { success: true, message: "Producto eliminado", data: product };
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

export async function editProductAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return { success: false, message: "Debes iniciar sesión" };
    }
    const { id, ...data } = Object.fromEntries(formData);
    const productId = Number(id);
    if (isNaN(productId))
      return {
        success: false,
        message: "Se requiere un id de producto valido",
      };

    const validation = ProductPatchSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Los datos de la petición son invalidos",
        errors: z.treeifyError(validation.error).errors,
      };
    }

    const product = await patchProduct(productId, validation.data);
    revalidatePath("/products", "page");
    return { success: true, message: "Producto eliminado", data: product };
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
