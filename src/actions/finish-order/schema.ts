import { z } from "zod";

export const finishOrderSchema = z.object({
  shippingAddress: z.string().min(1, "Endereço de entrega é obrigatório"),
  items: z.array(
    z.object({
      productVariantId: z.uuid(),
      quantity: z.number().min(1),
    }),
  ),
});

export type FinishOrderSchema = z.infer<typeof finishOrderSchema>;
