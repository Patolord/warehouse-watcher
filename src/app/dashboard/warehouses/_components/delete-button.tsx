"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";

interface DeleteWarehouseProps {
    warehouseId: Id<"warehouses">
    warehouseName: string;

}

export function DeleteWarehouse({ warehouseId, warehouseName }: DeleteWarehouseProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteWarehouse = useMutation(api.warehouses.deleteWarehouseById);



    const handleDelete = async () => {
        setIsDeleting(true);
        try {


            await deleteWarehouse({ warehouseId });
            console.log("Deleting warehouse:", warehouseId);

        } catch (error) {
            console.error("Failed to delete warehouse:", error);
            // Optionally, show an error message to the user
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <>

            <Button
                size="sm"
                variant="link"
                onClick={() => setIsDeleteDialogOpen(true)}
            >

                <Trash2 className="h-4 w-4" color="#ff0000" />
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o armazém &quot;{warehouseName}&quot;? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}