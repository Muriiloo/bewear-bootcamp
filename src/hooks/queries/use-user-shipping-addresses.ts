import { useQuery } from "@tanstack/react-query";

import { getUserShippingAddresses } from "@/actions/get-user-shipping-addresses";

export const getUserShippingAddressesQueryKey = () =>
  ["user-shipping-addresses"] as const;

export const useUserShippingAddresses = () => {
  return useQuery({
    queryKey: getUserShippingAddressesQueryKey(),
    queryFn: () => getUserShippingAddresses(),
  });
};
