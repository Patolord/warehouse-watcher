import { InventoryItem } from "@/types/material";

export type CartMaterial = InventoryItem & { cartQuantity: number };