import { z } from "zod";

export const ProductPostSchema = z.object({
  name: z
    .string({ error: "Se requiere un nombre de producto" })
    .min(3)
    .max(100),
  description: z.string().min(3).max(1000),
  image: z.string(),
  category: z.string(),
  price: z.number().min(0),
  stock: z.number(),
});

export type ProductPostSchemaType = z.infer<typeof ProductPostSchema>;

export const ProductPatchSchema = z.object({
  name: z
    .string({ error: "Se requiere un nombre de producto" })
    .min(3)
    .max(100),
  description: z.string().min(10).max(1000),
  image: z.string(),
  category: z.string(),
  price: z.number().min(100),
  stock: z.number().min(0),
});

export const ProductDeleteSchema = z.object({
  id: z.number({
    error: "Se requiere el ID del producto que se desea eliminar",
  }),
});
