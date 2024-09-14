import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Id } from '../../convex/_generated/dataModel';

export type Material = {
    url: string | null;
    _id: Id<"materials">;
    _creationTime: number;
    type?: string;
    imageFileId?: Id<"_storage">;
    additionalAttributes?: any;
    currentVersionId?: Id<"materialVersions">;
    qrCode?: string;
    userId: string;
    name: string;
};

interface MaterialsState {
    materials: Material[] | null;
    setMaterials: (materials: Material[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useMaterialsStore = create<MaterialsState>()(
    persist(
        (set) => ({
            materials: null,
            setMaterials: (materials) => set({ materials }),
            isLoading: true,
            setIsLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'materials-storage',
            getStorage: () => localStorage,
        }
    )
);