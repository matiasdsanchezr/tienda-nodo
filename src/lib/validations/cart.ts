import { z } from "zod/v4";

export const CartItemPatchSchema = z.object({
  quantity: z.int({ error: "Se requiere una cantidad válida" }).min(1).max(99),
});

export const AddToCartSchema = z.object({
  productId: z.coerce.number({ error: "ID inválido" }).positive(),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "La cantidad debe ser al menos 1")
    .default(1),
});
