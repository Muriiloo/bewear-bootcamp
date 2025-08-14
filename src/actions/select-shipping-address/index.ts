"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type z from "zod";

import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { selectShippingAddressSchema } from "./schema";

export const selectShippingAddress = async (
  data: z.infer<typeof selectShippingAddressSchema>,
) => {
  selectShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const address = await db.query.shippingAddressTable.findFirst({
    where: eq(shippingAddressTable.id, data.addressId),
  });

  if (!address || address.userId !== session.user.id) {
    throw new Error("Address not found or unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await db
    .update(cartTable)
    .set({
      shippingAddressId: data.addressId,
    })
    .where(eq(cartTable.id, cart.id));

  return address;
};
