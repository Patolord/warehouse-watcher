import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Id } from '../../convex/_generated/dataModel';


export type Warehouse = {
  _id: Id<"warehouses">;
  _creationTime: number;
  name: string;
  address?: string; // Make address optional
  userId: string;
  // Add any other fields that your warehouse object contains
};

interface WarehousesState {
  warehouses: Warehouse[] | null;
  setWarehouses: (warehouses: Warehouse[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useWarehousesStore = create<WarehousesState>()(
  persist(
    (set) => ({
      warehouses: null,
      setWarehouses: (warehouses) => set({ warehouses }),
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'warehouses-storage',
      getStorage: () => localStorage,
    }
  )
);