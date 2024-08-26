import React, { useState } from 'react';
import { api } from "../../../../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MapSelector = dynamic(() => import('./MapSelector'), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve conter no mínimo 3 caracteres",
  }),
  address: z.string().min(1, {
    message: "Endereço é obrigatório",
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressNotFound, setAddressNotFound] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: -23.5505, // São Paulo coordinates as default
      longitude: -46.6333,
    },
  });

  const createWarehouse = useMutation(api.warehouses.createWarehouse);

  const onSubmit = async (values: FormValues) => {
    await createWarehouse({
      name: values.name,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
    });

    form.reset();
    setIsDialogOpen(false);
    toast.success("Estoque adicionado com sucesso.");
  };

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    form.setValue('address', address);
    setAddressNotFound(false);
  };

  const geocodeAddress = async () => {
    const address = form.getValues('address');
    if (!address) {
      toast.error("Por favor, insira um endereço antes de atualizar o mapa.");
      return;
    }

    setIsGeocoding(true);
    setAddressNotFound(false);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationChange(parseFloat(lat), parseFloat(lon), address);
        toast.success("Mapa atualizado com sucesso.");
      } else {
        setAddressNotFound(true);
        toast.error("Endereço não encontrado. Por favor, ajuste manualmente no mapa.");
      }
    } catch (error) {
      console.error("Erro ao geocodificar o endereço:", error);
      setAddressNotFound(true);
      toast.error("Erro ao buscar o endereço. Por favor, ajuste manualmente no mapa.");
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Estoque</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Estoque</DialogTitle>
          <DialogDescription>
            Digite o nome e endereço do estoque, e clique em "Atualizar Mapa" para ajustar a localização.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do estoque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Endereço completo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={geocodeAddress}
                disabled={isGeocoding}
                className="flex gap-1"
              >
                {isGeocoding && <Loader2 className="h-4 w-4 animate-spin" />}
                Atualizar Mapa
              </Button>

              {addressNotFound && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Endereço não encontrado. Por favor, ajuste manualmente no mapa.
                  </AlertDescription>
                </Alert>
              )}

              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <MapSelector
                    latitude={form.watch('latitude')}
                    longitude={form.watch('longitude')}
                    onLocationChange={handleLocationChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="flex items-center space-x-2 text-yellow-600">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">
                  Ajuste a localização no mapa se necessário para maior precisão.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}