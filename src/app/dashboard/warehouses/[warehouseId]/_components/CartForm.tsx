import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
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
    }))
  );

  const warehouses = useQuery(api.warehouses.getWarehouses);

  const warehousesMinusCurrent = warehouses?.filter(
    (warehouse) => warehouse._id !== warehouseId
  );

  const updateInventory = useMutation(api.inventories.updateInventory);

  const formSchema = z
    .object({
      description: z.string().optional(),
      toWarehouseId: z.string().optional(),
      consumeHere: z.boolean().default(false),
      materialsError: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.consumeHere && !data.toWarehouseId) {
          return false;
        }
        return true;
      },
      {
        message: "Selecione um estoque de destino ou marque para consumir aqui",
        path: ["toWarehouseId"],
      }
    );

  const materialsSchema = z
    .array(
      z.object({
        materialId: z.custom<Id<"materials">>(),
        quantity: z.number().min(1),
      })
    )
    .min(1, { message: "Deve haver pelo menos um material" });

  const form = useForm<z.infer<typeof formSchema>>({
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

    try {
      await updateInventory({
        fromWarehouse: warehouseId,
        toWarehouse: values.consumeHere ? undefined : values.toWarehouseId as Id<"warehouses">,
        actionType: values.consumeHere ? "remove" : "transfer",
        materials: materials,
        description: values.description,
      });

      toast.success(values.consumeHere ? "Materiais consumidos com sucesso!" : "Transferência realizada com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro ao processar a operação: " + (error as Error).message);
    }
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
                  onValueChange={field.onChange}
                  value={field.value}
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
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Consumir no estoque atual</FormLabel>
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

          <Button type="submit">
            {form.watch("consumeHere") ? "Consumir" : "Transferir"}
          </Button>
        </div>
      </form>
    </Form>
  );
}