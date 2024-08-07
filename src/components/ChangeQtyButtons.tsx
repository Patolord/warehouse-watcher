import { Id } from "../../convex/_generated/dataModel";
import { X } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getStore } from "@/store/store";

export function ChangeQtyButtons({
  inventoryItemId,
  warehouseId,
}: {
  inventoryItemId: Id<"materials">;
  warehouseId: Id<"warehouses">;
}) {
  const useStore = getStore(warehouseId);
  const { getMaterialById, incQty, decQty, removeMaterial } = useStore(
    useShallow((state) => ({
      getMaterialById: state.getMaterialById,
      incQty: state.incQty,
      decQty: state.decQty,
      removeMaterial: state.removeMaterial,
    }))
  );

  const item = getMaterialById(inventoryItemId);
  const [inputValue, setInputValue] = useState(item?.cartQuantity || 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    if (value === "") {
      setInputValue(0);
    } else if (
      !isNaN(parsedValue) &&
      parsedValue >= 0 &&
      parsedValue <= item!.quantity
    ) {
      setInputValue(parsedValue);
    }
  };

  const handleBlur = () => {
    const delta = inputValue - item!.cartQuantity;
    if (delta > 0) {
      incQty(item!.materialId, delta);
    } else if (delta < 0) {
      decQty(item!.materialId, -delta);
    }
  };

  return (
    <div className="flex gap-2 items-center text-right">
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="text-center w-[70px]"
        min="0"
        max={item?.quantity}
      />

      <Button
        variant="link"
        size="icon"
        onClick={() => removeMaterial(item!.materialId)}
      >
        <X color="#ff0000" size={20} />
      </Button>
    </div>
  );
}
