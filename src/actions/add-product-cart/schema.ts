import { z } from "zod";

export const addProductCartSchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().min(1),
});

export type AddProductCartSchema = z.infer<typeof addProductCartSchema>;
