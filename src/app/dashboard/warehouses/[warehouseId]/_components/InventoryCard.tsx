import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";

import { ChangeQtyButtons } from "@/components/ChangeQtyButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStore } from "@/store/store";
import { InventoryItem } from "@/types/material";

export default function MaterialCard({
  material,
}: {
  material: InventoryItem;
}) {
  const useStore = getStore(material.warehouseId);
  const { addMaterial, inventoryItems } = useStore(
    useShallow((state) => ({
      inventoryItems: state.inventoryItems,
      addMaterial: state.addMaterial,
    })),
  );

  return (
    <Card key={material.materialId} className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex flex-col gap-2  items-center">
          <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
            {material.imageUrl ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Image
                    src={material.imageUrl}
                    alt={material.materialName}
                    width={32}
                    height={32}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <Image
                    src={material.imageUrl}
                    alt={material.materialName}
                    width={300}
                    height={300}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageIcon size={24} />
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-${material.materialType?.toLowerCase()}-foreground border-${material.materialType?.toLowerCase()}`}
          >
            {material.materialType}
          </Badge>
        </div>

        <div className="flex flex-col items-start gap-4 w-full">
          <div className="font-semibold">{material.materialName}</div>

          <div className="flex items-center gap-2 justify-between w-full">
            <div className="text-md font-medium pl-2">
              {material.quantity} un.
            </div>
            {inventoryItems.find(
              (item) => item.materialId === material.materialId,
            ) ? (
              <ChangeQtyButtons
                inventoryItemId={material.materialId}
                warehouseId={material.warehouseId}
              />
            ) : (
              <div className="flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => addMaterial(material)}
                >
                  Transferir
                </Button>
                <div className="h-[40px] w-[20px]"></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
