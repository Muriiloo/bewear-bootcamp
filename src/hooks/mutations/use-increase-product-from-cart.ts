import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductCart } from "@/actions/add-product-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getIncreaseProductFromCartMutationKey = (cartItemId: string) =>
  ["increase-product-from-cart", cartItemId] as const;

export const useIncreaseProductFromCart = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getIncreaseProductFromCartMutationKey(productVariantId),
    mutationFn: () => addProductCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
