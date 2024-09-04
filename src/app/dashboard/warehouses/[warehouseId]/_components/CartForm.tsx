import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
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
import { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

export default function CartForm({
  warehouseId,
  setIsOpen,
}: {
  warehouseId: Id<"warehouses">;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const useStore = getStore(warehouseId);
  const { inventoryItems, reset } = useStore(
    useShallow((state) => ({
      inventoryItems: state.inventoryItems,
      reset: state.reset,
    }))
  );

  const warehouses = useQuery(api.warehouses.getWarehousesByUser);

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
        message: "Select a destination warehouse or mark to consume here",
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
    .min(1, { message: "There must be at least one material" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      toWarehouseId: "",
      consumeHere: false,
      materialsError: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
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
        toWarehouse: values.consumeHere
          ? undefined
          : (values.toWarehouseId as Id<"warehouses">),
        actionType: values.consumeHere ? "removed" : "transfered",
        materials: materials,
        description: values.description,
      });

      const successMessage = values.consumeHere
        ? "Materials consumed successfully!"
        : "Transfer completed successfully!";

      reset();
      toast({
        title: "Success",
        description: successMessage,
      });
      setIsOpen(false); // Close the sheet after successful submission

      // Move the projectplannerai fetch outside the main try-catch block
      try {
        await fetch("https://projectplannerai.com/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "User realized a transaction",
            projectId: process.env.NEXT_PUBLIC_PROJECT_PLANNER_ID,
          }),
        });
      } catch (error) {
        // Silently handle the error or log it if needed
        console.error("Failed to send event to projectplannerai:", error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error processing operation: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                <FormLabel>To warehouse:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={form.watch("consumeHere")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination warehouse" />
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
                  <FormLabel>Consume in current warehouse</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Note:" {...field} />
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : form.watch("consumeHere")
                ? "Consume"
                : "Transfer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
