"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addProductCart } from "@/actions/add-product-cart";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

export function AddToCartButton({
  productVariantId,
  quantity,
}: AddToCartButtonProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      toast.success("Produto adicionado ao carrinho");
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar a sacola
    </Button>
  );
}
