import React, { useState } from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import MaterialList from "./MaterialList";
import { NewMaterialDialog } from "./NewMaterialDialog";

const materialSchema = z.object({
  materialId: z.string(),
  quantity: z.coerce.number().min(1),
});

export function AddMaterialButton({ warehouseId }: { warehouseId: Id<"warehouses"> }) {
  const createTransaction = useMutation(api.inventories.updateInventory);
  const materials = useQuery(api.materials.getMaterialsByUser);
  const [materialsList, setMaterialsList] = useState<{ materialId: Id<"materials">; materialName: string; quantity: number }[]>([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [isNewMaterialDialogOpen, setIsNewMaterialDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: { materialId: "", quantity: 1 },
  });

  const removeMaterial = (index: number) => {
    setMaterialsList((prev) => prev.filter((_, i) => i !== index));
  };

  const { handleSubmit, reset, getValues, formState: { isSubmitting } } = form;

  const onAddMaterial = () => {
    const { materialId, quantity } = getValues();
    const material = materials!.find((mat) => mat._id === materialId);
    if (material) {
      const isAlreadyAdded = materialsList.some((item) => item.materialId === materialId);
      if (!isAlreadyAdded) {
        setMaterialsList([...materialsList, { materialId: material._id, materialName: material.name, quantity: Number(quantity) }]);
      } else {
        toast.error("Material já adicionado à lista.");
      }
      reset({ materialId: "", quantity: 1 });
    }
  };

  const onSubmit = async () => {
    try {
      const orderData = {
        materials: materialsList.map(({ materialId, quantity }) => ({ materialId, quantity })),
        description: orderDescription,
        toWarehouse: warehouseId,
      };

      await createTransaction({
        toWarehouse: orderData.toWarehouse,
        actionType: "add",
        materials: orderData.materials,
        description: orderData.description,
      });

      await fetch("https://projectplannerai.com/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "User added a material to a warehouse", projectId: "j5742cwe4q0jd7ga6qwbb827r56sm1n7" }),
      });

      setMaterialsList([]);
      setOrderDescription("");
      toast.success("Movimentação criada com sucesso!");
    } catch (error) {
      const errorMessage = error instanceof ConvexError ? (error.data as { message: string }).message : "Erro inesperado";
      toast.error(errorMessage);
    }
  };

  const handleNewMaterialCreated = (newMaterial: { materialId: Id<"materials">; versionId: Id<"materialVersions">; name: string }) => {
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
          Adicionar Material
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar materiais</SheetTitle>
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
                            className={cn("justify-between w-full", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? materials?.find((material) => material._id === field.value)?.name || "Selecione o material"
                              : "Selecione o material"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar material..." className="w-full" />
                          <CommandList className="max-h-[200px]">
                            <CommandEmpty>Nenhum material encontrado.</CommandEmpty>
                            <CommandGroup>
                              {materials?.map((material) => (
                                <CommandItem
                                  value={material.name}
                                  key={material._id}
                                  onSelect={() => {
                                    form.setValue("materialId", material._id);
                                    setOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", material._id === field.value ? "opacity-100" : "opacity-0")} />
                                  {material.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  setIsNewMaterialDialogOpen(true);
                                  setOpen(false);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Criar novo material
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="default" onClick={onAddMaterial} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar à lista
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <MaterialList materialsList={materialsList} onRemove={removeMaterial} />
              <Button
                type="button"
                variant="outline"
                onClick={() => setMaterialsList([])}
                className="w-full"
                disabled={materialsList.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar lista
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Descrição do Pedido</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Adicione uma descrição para o pedido..."
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
                Criar Movimentação
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