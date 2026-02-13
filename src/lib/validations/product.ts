import { z } from "zod";

export const ProductPostSchema = z.object({
  name: z
    .string({ error: "Se requiere un nombre de producto" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre puede tener un máximo de 100 caracteres" }),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" })
    .max(1000, {
      message: "La descripción puede tener un máximo de 1000 caracteres",
    }),
  image: z.string(),
  category: z.string().nonempty("Se requiere una categoría"),
  price: z.number().min(100, "El precio debe ser mayor o igual a 100"),
  stock: z.number().min(0, "El stock debe ser mayor o igual a 0"),
});

export type ProductPostSchemaType = z.infer<typeof ProductPostSchema>;

export const ProductPatchSchema = z.object({
  name: z.coerce
    .string({ error: "Se requiere un nombre de producto" })
    .min(3)
    .max(100),
  description: z.coerce.string().min(10).max(1000),
  image: z.coerce.string(),
  category: z.coerce.string(),
  price: z.coerce.number().min(100),
  stock: z.coerce.number().min(0),
});

export const ProductDeleteSchema = z.object({
  id: z.coerce.number({
    error: "Se requiere el ID del producto que se desea eliminar",
  }),
});
