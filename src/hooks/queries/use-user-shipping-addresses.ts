import { useQuery } from "@tanstack/react-query";

import { getUserShippingAddresses } from "@/actions/get-user-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUserShippingAddressesQueryKey = () =>
  ["user-shipping-addresses"] as const;

export const useUserShippingAddresses = (params: {
  initialData: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserShippingAddressesQueryKey(),
    queryFn: () => getUserShippingAddresses(),
    initialData: params.initialData,
  });
};
