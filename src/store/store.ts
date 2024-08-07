import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createCartSlice } from "./cartSlice";
import { Store } from "@/types/store";

const storeRegistry = new Map<string, ReturnType<typeof createStore>>();

const createStore = (warehouseId: Id<"warehouses">) =>
    create<Store>()(
        devtools(
            persist(
                subscribeWithSelector(
                    immer((...a) => ({
                        ...createCartSlice(...a),
                    })),
                ),
                { name: `warehouse-${warehouseId}` },
            ),
        ),
    );

export const getStore = (warehouseId: Id<"warehouses">) => {
    if (!storeRegistry.has(warehouseId)) {
        storeRegistry.set(warehouseId, createStore(warehouseId));
    }
    return storeRegistry.get(warehouseId) as ReturnType<typeof createStore>;
};