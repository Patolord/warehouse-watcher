import { Id } from "../../convex/_generated/dataModel";
import { ImageIcon, Truck } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStore } from "@/store/store";
import { ChangeQtyButtons } from "./ChangeQtyButtons";
import CartForm from "@/app/dashboard/warehouses/[warehouseId]/_components/CartForm";

export function Cart({ warehouseId }: { warehouseId: Id<"warehouses"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const useStore = getStore(warehouseId);
  const { reset, inventoryItems } = useStore(
    useShallow((state) => ({
      reset: state.reset,
      inventoryItems: state.inventoryItems,
    }))
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  const handleSubmitSuccess = (message: string) => {
    setIsOpen(false);
    toast({
      title: "Sucesso",
      description: message,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="relative" disabled={inventoryItems.length === 0}>
          {inventoryItems.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
              {inventoryItems.length}
            </div>
          )}

          <Truck />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-screen sm:w-[500px] sm:max-w-none">
        <SheetHeader>
          <div className="flex flex-col gap-2 text-lg justify-center items-center">
            <h1>Romaneio</h1>
            {inventoryItems.length > 0 ? (
              <Button onClick={reset} variant="secondary" size="sm">
                Limpar
              </Button>
            ) : null}
          </div>
        </SheetHeader>
        <div className="hidden sm:block space-y-2">
          {inventoryItems.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      Imagem
                      <span className="sr-only">Imagem</span>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Quantidade
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.materialId}>
                      <TableCell className="hidden sm:table-cell">
                        {item.imageUrl ? (
                          <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="32"
                            src={item.imageUrl}
                            width="32"
                          />
                        ) : (
                          <ImageIcon />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.materialName}
                        <div className="font-light">
                          Em estoque: {item.quantity}
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <ChangeQtyButtons
                          inventoryItemId={item.materialId}
                          warehouseId={item.warehouseId}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="flex pt-10 justify-center">Nenhum item adicionado</p>
          )}
        </div>

        <div className="sm:hidden">
          <ScrollArea className="h-[300px]">
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item) => (
                <div
                  key={item.materialId}
                  className="my-1 p-4 border rounded-md shadow-sm flex justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      {item.imageUrl ? (
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="32"
                          src={item.imageUrl}
                          width="32"
                        />
                      ) : (
                        <ImageIcon />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {item.materialName}
                      </h3>
                      <p className="text-sm">Em Estoque: {item.cartQuantity}</p>
                    </div>
                  </div>
                  <div>
                    <ChangeQtyButtons
                      inventoryItemId={item.materialId}
                      warehouseId={item.warehouseId}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="flex pt-10 justify-center">
                Nenhum item adicionado
              </p>
            )}
          </ScrollArea>
        </div>
        <Separator />

        <div className="pt-5">
          <CartForm warehouseId={warehouseId} setIsOpen={setIsOpen} />
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
