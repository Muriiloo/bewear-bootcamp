import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createShippingAddress } from "@/actions/create-shipping-address";

import { getUseCartQueryKey } from "../queries/use-cart";
import { getUserShippingAddressesQueryKey } from "../queries/use-user-shipping-addresses";

export const getCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateShippingAddressMutationKey(),
    mutationFn: createShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getUserShippingAddressesQueryKey(),
      });
    },
  });
};
