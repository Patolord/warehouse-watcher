import React, { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import MaterialList from "./MaterialList";
import { NewMaterialDialog } from "./NewMaterialDialog";

export function AddMaterialButton({
  warehouseId,
}: {
  warehouseId: Id<"warehouses">;
}) {
  const createTransaction = useMutation(api.inventories.updateInventory);
  const materials = useQuery(api.materials.getMaterialsByUser);
  const [materialsList, setMaterialsList] = useState<
    { materialId: Id<"materials">; materialName: string; quantity: number }[]
  >([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [isNewMaterialDialogOpen, setIsNewMaterialDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: { materialId: "" },
  });

  const removeMaterial = (index: number) => {
    setMaterialsList((prev) => prev.filter((_, i) => i !== index));
  };

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = form;

  const onAddMaterial = () => {
    const { materialId } = getValues();
    const material = materials?.find((mat) => mat._id === materialId);
    if (material) {
      const isAlreadyAdded = materialsList.some(
        (item) => item.materialId === materialId
      );
      if (!isAlreadyAdded) {
        setMaterialsList([
          ...materialsList,
          {
            materialId: material._id,
            materialName: material.name,
            quantity: 1, // Default quantity
          },
        ]);
      } else {
        toast.error("Material already added to the list.");
      }
      reset({ materialId: "" });
    }
  };

  const onSubmit = async () => {
    try {
      const orderData = {
        materials: materialsList.map(({ materialId, quantity }) => ({
          materialId,
          quantity,
        })),
        description: orderDescription,
        toWarehouse: warehouseId,
      };

      await createTransaction({
        toWarehouse: orderData.toWarehouse,
        actionType: "added",
        materials: orderData.materials,
        description: orderData.description,
      });

      setMaterialsList([]);
      setOrderDescription("");
      toast.success("Movement created successfully!");

      // Move the projectplannerai fetch outside the main try-catch block
      try {
        await fetch("https://projectplannerai.com/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "User added a material to a warehouse",
            projectId: process.env.NEXT_PUBLIC_PROJECT_PLANNER_ID,
          }),
        });
      } catch (error) {
        // Silently handle the error or log it if needed
        console.error("Failed to send event to projectplannerai:", error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as { message: string }).message
          : "Unexpected error";
      toast.error(errorMessage);
    }
  };

  const handleNewMaterialCreated = (newMaterial: {
    materialId: Id<"materials">;
    versionId: Id<"materialVersions">;
    name: string;
  }) => {
    form.setValue("materialId", newMaterial.materialId);
    // If you need to update the materials list, you might want to refetch or update it here
    // For example:
    // refetchMaterials();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Materials</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <div className="space-y-6 mt-6 overflow-y-auto flex-grow">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="materialId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Material</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "justify-between w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? materials?.find(
                                  (material) => material._id === field.value
                                )?.name || "Select the material"
                              : "Select the material"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px] max-h-[300px] overflow-hidden">
                        <Command className="w-full h-full overflow-hidden">
                          <CommandInput
                            placeholder="Search material..."
                            className="w-full"
                          />
                          <CommandList className="max-h-[228px] overflow-y-auto">
                            <CommandEmpty>No material found.</CommandEmpty>

                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  setIsNewMaterialDialogOpen(true);
                                  setOpen(false);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Create new material
                              </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup className="overflow-y-auto">
                              {materials?.map((material) => (
                                <CommandItem
                                  value={material.name}
                                  key={material._id}
                                  onSelect={() => {
                                    form.setValue("materialId", material._id);
                                    setOpen(false);
                                    onAddMaterial(); // Add material immediately upon selection
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      material._id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {material.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <MaterialList
                materialsList={materialsList}
                onRemove={removeMaterial}
                onUpdateQuantity={(index, newQuantity) => {
                  setMaterialsList((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, quantity: newQuantity } : item
                    )
                  );
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setMaterialsList([])}
                className="w-full"
                disabled={materialsList.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear list
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Order Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add a description for the order..."
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    className="w-full"
                  />
                </FormControl>
              </FormItem>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || materialsList.length === 0}
                className="w-full"
              >
                Create Movement
              </Button>
            </div>
          </div>
        </Form>
      </SheetContent>

      <NewMaterialDialog
        isOpen={isNewMaterialDialogOpen}
        onClose={() => setIsNewMaterialDialogOpen(false)}
        onCreated={handleNewMaterialCreated}
      />
    </Sheet>
  );
}
