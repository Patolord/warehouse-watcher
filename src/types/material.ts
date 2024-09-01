import { Id } from "../../convex/_generated/dataModel";

export type InventoryItem = {
    materialId: Id<"materials">;
    materialName: string;
    quantity: number;
    warehouseId: Id<"warehouses">;
    imageUrl: string | null;
    materialType: string | undefined;
    qrCode?: string; // Add this line
};