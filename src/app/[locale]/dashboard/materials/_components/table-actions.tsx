import { api } from "../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Info, Pencil, Trash } from "lucide-react";
import { useState } from "react";

import EditSheet from "./edit-sheet";
import { UploadModal } from "./upload-modal";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import Link from "next/link";

export default function Actions({ material }: { material: Doc<"materials"> }) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const checkMaterialMovement = false
  const deleteMaterial = useMutation(api.materials.deleteMaterialById);

  return (
    <>
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <EditSheet material={material} />
      </Sheet>

      <div className="flex gap-2">
        {!checkMaterialMovement ? (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => deleteMaterial({ materialId: material._id })}
          >
            <Trash size={18} color="#cc1414" />
          </Button>
        ) : (
          "Bloqueado"
        )}
        <Button size="xs" variant="ghost" onClick={() => setIsEditOpen(true)}>
          <Pencil size={18} />
        </Button>
        <UploadModal materialId={material._id} />

        <Button size="xs" variant="ghost">
          <Link href={`/dashboard/materials/${material._id}`}><Info /></Link>
        </Button>
      </div>
    </>
  );
}
