import { z } from "zod/v4";

export const UpdateUserPostSchema = z.object({
  name: z.string({ error: "Se requiere un nombre" }).min(3).max(100),
});

export const ChangePasswordPostSchema = z.object({
  newPassword: z.string(),
  currentPassword: z.string(),
});
