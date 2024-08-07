import { StateCreator } from "zustand";

import { CartMaterial } from "@/types/cartMaterial";
import { InventoryItem } from "@/types/material";

type CartState = {
    inventoryItems: CartMaterial[];
};

type CartActions = {
    addMaterial: (inventoryItem: InventoryItem) => void;
    removeMaterial: (inventoryItemId: string) => void;
    incQty: (inventoryItemId: string, amount?: number) => void;
    decQty: (inventoryItemId: string, amount?: number) => void;
    getMaterialById: (inventoryItemId: string) => CartMaterial | undefined;
    reset: () => void;
};

export type CartSlice = CartState & CartActions;

const initialState: CartState = {
    inventoryItems: [],
};

export const createCartSlice: StateCreator<
    CartSlice,
    [["zustand/immer", never]],
    [],
    CartSlice
> = (set, get) => ({
    ...initialState,
    incQty: (inventoryItemId, amount = 1) =>
        set((state) => {
            const foundMaterial = state.inventoryItems.find(
                (inventoryItem) => inventoryItem.materialId === inventoryItemId,
            );
            if (foundMaterial) {
                if (foundMaterial.cartQuantity + amount <= foundMaterial.quantity) {
                    foundMaterial.cartQuantity += amount;
                } else {
                    foundMaterial.cartQuantity = foundMaterial.quantity;
                }
            }
        }),
    decQty: (inventoryItemId, amount = 1) =>
        set((state) => {
            const foundIndex = state.inventoryItems.findIndex(
                (inventoryItem) => inventoryItem.materialId === inventoryItemId,
            );

            if (foundIndex !== -1) {
                if (state.inventoryItems[foundIndex].cartQuantity <= amount) {
                    state.inventoryItems.splice(foundIndex, 1);
                } else {
                    state.inventoryItems[foundIndex].cartQuantity -= amount;
                }
            }
        }),
    addMaterial: (inventoryItem) =>
        set((state) => {
            state.inventoryItems.push({ ...inventoryItem, cartQuantity: 1 });
        }),
    removeMaterial: (inventoryItemId) =>
        set((state) => {
            state.inventoryItems = state.inventoryItems.filter(
                (inventoryItem) => inventoryItem.materialId !== inventoryItemId,
            );
        }),
    getMaterialById: (inventoryItemId) =>
        get().inventoryItems.find(
            (inventoryItem) => inventoryItem.materialId === inventoryItemId,
        ),

    reset: () => set(() => initialState),
});