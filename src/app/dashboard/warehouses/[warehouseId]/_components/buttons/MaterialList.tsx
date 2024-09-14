import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Id } from "../../../../../../../convex/_generated/dataModel";

interface Material {
  materialId: string;
  materialName: string;
  quantity: number;
}

interface MaterialListProps {
  materialsList: {
    materialId: Id<"materials">;
    materialName: string;
    quantity: number;
  }[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
}

export default function MaterialList({
  materialsList,
  onRemove,
  onUpdateQuantity,
}: MaterialListProps) {
  return (
    <div className="space-y-4">
      {materialsList.map((material, index) => (
        <div key={material.materialId} className="flex items-center space-x-2">
          <span className="flex-grow">{material.materialName}</span>
          <Input
            type="number"
            min={1}
            value={material.quantity}
            onChange={(e) => onUpdateQuantity(index, Number(e.target.value))}
            className="w-20"
          />
          <Button
            variant="ghost"
            className="text-red-600"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
