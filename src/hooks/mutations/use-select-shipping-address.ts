import { useMutation, useQueryClient } from "@tanstack/react-query";

import { selectShippingAddress } from "@/actions/select-shipping-address";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getSelectShippingAddressMutationKey = () =>
  ["select-shipping-address"] as const;

export const useSelectShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getSelectShippingAddressMutationKey(),
    mutationFn: selectShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
