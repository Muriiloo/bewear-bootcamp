"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useSelectShippingAddress } from "@/hooks/mutations/use-select-shipping-address";
import { useUserShippingAddresses } from "@/hooks/queries/use-user-shipping-addresses";

const addressFormSchema = z.object({
  email: z.string().email("Email inválido"),
  recipientName: z.string().min(1, "Nome completo é obrigatório"),
  cpfOrCnpj: z.string().min(14, "CPF inválido"),
  phone: z.string().min(15, "Celular inválido"),
  zipCode: z.string().min(9, "CEP inválido"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

type AddressFormSchema = z.infer<typeof addressFormSchema>;

interface AddressesProps {
  shippingAddress: (typeof shippingAddressTable.$inferSelect)[];
}

const Addresses = ({ shippingAddress }: AddressesProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const createShippingAddressMutation = useCreateShippingAddress();
  const selectShippingAddressMutation = useSelectShippingAddress();
  const { data: addresses, isLoading: isLoadingAddresses } =
    useUserShippingAddresses({ initialData: shippingAddress });

  const form = useForm<AddressFormSchema>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      recipientName: "",
      cpfOrCnpj: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: AddressFormSchema) => {
    try {
      await createShippingAddressMutation.mutateAsync(values);
      form.reset();
      setSelectedAddress(null);
      toast.success("Endereço criado com sucesso!");
    } catch {
      toast.error("Erro ao criar endereço. Tente novamente.");
    }
  };

  const handleSelectExistingAddress = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await selectShippingAddressMutation.mutateAsync({
        addressId: selectedAddress,
      });
      toast.success("Endereço selecionado com sucesso!");
    } catch {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          {isLoadingAddresses ? (
            <div className="py-4 text-center">Carregando endereços...</div>
          ) : (
            <>
              {addresses?.map((address) => (
                <Card key={address.id}>
                  <CardContent>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <div className="flex-1">
                        <Label htmlFor={address.id} className="cursor-pointer">
                          <div className="text-sm">
                            {address.recipientName} - {address.street},{" "}
                            {address.number}
                            {address.complement &&
                              `, ${address.complement}`} -{" "}
                            {address.neighborhood}, {address.city} -{" "}
                            {address.state} - CEP: {address.zipCode}
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add_new" id="add_new" />
                    <Label htmlFor="add_new">Adicionar novo</Label>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </RadioGroup>

        {selectedAddress && selectedAddress !== "add_new" && (
          <Button
            onClick={handleSelectExistingAddress}
            className="mt-4 w-full"
            disabled={selectShippingAddressMutation.isPending}
          >
            {selectShippingAddressMutation.isPending
              ? "Selecionando endereço..."
              : "Continuar com o pagamento"}
          </Button>
        )}

        {selectedAddress === "add_new" && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Dados de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpfOrCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              format="###.###.###-##"
                              mask="_"
                              placeholder="000.000.000-00"
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.formattedValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Celular</FormLabel>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              format="(##) #####-####"
                              mask="_"
                              placeholder="(00) 00000-0000"
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.formattedValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              format="#####-###"
                              mask="_"
                              placeholder="00000-000"
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.formattedValue);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Complemento (opcional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite o estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createShippingAddressMutation.isPending}
                  >
                    {createShippingAddressMutation.isPending
                      ? "Criando endereço..."
                      : "Continuar com o pagamento"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
