import { z } from "zod";

export const selectShippingAddressSchema = z.object({
  addressId: z.string().uuid("ID do endereço inválido"),
});
