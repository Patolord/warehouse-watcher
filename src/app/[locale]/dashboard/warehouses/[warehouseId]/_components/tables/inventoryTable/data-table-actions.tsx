import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { useShallow } from "zustand/react/shallow";

import { ChangeQtyButtons } from "@/components/ChangeQtyButtons";
import { Button } from "@/components/ui/button";
import { getStore } from "@/store/store";
import { InventoryItem } from "@/types/material";

export default function Actions({
  inventory,
  warehouseId,
}: {
  inventory: InventoryItem;
  warehouseId: Id<"warehouses">;
}) {
  const useStore = getStore(warehouseId);
  const { addMaterial, inventoryItems } = useStore(
    useShallow((state) => ({
      inventoryItems: state.inventoryItems,
      addMaterial: state.addMaterial,
    })),
  );

  return (
    <div className="flex items-center">
      {inventoryItems.find(
        (item) => item.materialId === inventory.materialId,
      ) ? (
        <ChangeQtyButtons
          inventoryItemId={inventory.materialId}
          warehouseId={warehouseId}
        />
      ) : (
        <div className="flex items-center">
          <Button variant="secondary" onClick={() => addMaterial(inventory)}>
            Transferir
          </Button>

          <div className="h-[40px] w-[40px]"></div>
        </div>
      )}
    </div>
  );
}
