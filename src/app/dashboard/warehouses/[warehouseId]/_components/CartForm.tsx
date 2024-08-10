import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStore } from "@/store/store";

export default function CartForm({
  warehouseId,
}: {
  warehouseId: Id<"warehouses">;
}) {
  const useStore = getStore(warehouseId);
  const { inventoryItems, reset } = useStore(
    useShallow((state) => ({
      inventoryItems: state.inventoryItems,
      reset: state.reset,
    })),
  );

  const warehouses = useQuery(api.warehouses.getWarehouses);

  const warehousesMinusCurrent = warehouses?.filter(
    (warehouse) => warehouse._id !== warehouseId,
  );

  const transferStockMovement = useMutation(
    api.material_movements.transferStockMovement,
  );

  const removeStockMovement = useMutation(
    api.material_movements.removeStockMovement,
  );

  const formSchema = z
    .object({
      description: z.string().optional(),
      toWarehouseId: z.string().optional(), // Optional field for conditional validation
      consumeHere: z.boolean().optional(), // New field to toggle consumption
      materialsError: z.string().optional(), // Custom field for materials error
    })
    .refine(
      (data) => {
        if (!data.consumeHere && !data.toWarehouseId) {
          return false;
        }
        return true;
      },
      {
        message: "Selecione um estoque de destino",
        path: ["toWarehouseId"],
      },
    );

  const materialsSchema = z
    .array(
      z.object({
        materialId: z
          .string()
          .min(1, { message: "O ID do material é obrigatório" }),
        materialName: z
          .string()
          .min(1, { message: "O nome do material é obrigatório" }),
        quantity: z
          .number()
          .min(1, { message: "A quantidade deve ser maior que zero" }),
      }),
    )
    .min(1, { message: "Deve haver pelo menos um material" });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      toWarehouseId: "",
      consumeHere: false,
      materialsError: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const materials = inventoryItems.map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      quantity: item.cartQuantity,
    }));

    const materialsValidation = materialsSchema.safeParse(materials);

    if (!materialsValidation.success) {
      form.setError("materialsError", {
        type: "manual",
        message: materialsValidation.error.errors
          .map((e) => e.message)
          .join(", "),
      });
      return;
    }

    if (values.consumeHere) {
      await removeStockMovement({
        materials,
        description: values.description,
        fromWarehouseId: warehouseId,
      });
    } else {
      await transferStockMovement({
        materials,
        description: values.description,
        fromWarehouseId: warehouseId,
        toWarehouseId: values.toWarehouseId as Id<"warehouses">,
      });
    }

    // Clear the cart after the transfer
    reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="toWarehouseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Para o estoque:</FormLabel>
                <Select
                  onValueChange={(value) => {
                    // Convert the selected ID to the custom type and handle form state update
                    const formattedId = value as Id<"warehouses">;
                    field.onChange(formattedId);
                    // Optionally update local state if needed
                  }}
                  defaultValue={field.value}
                  disabled={form.watch("consumeHere")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estoque de destino" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehousesMinusCurrent?.map((warehouse) => (
                      <SelectItem key={warehouse._id} value={warehouse._id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consumeHere"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-4">
                  <FormLabel>Consumir no estoque atual</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="OBS:" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.materialsError && (
            <div className="text-red-500">
              {form.formState.errors.materialsError.message}
            </div>
          )}

          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </Form>
  );
}
