"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateButton as CreateMaterialButton } from "../materials/_components/create-button";
import { CreateButton as CreateWarehouseButton } from "../warehouses/_components/create-button";

export function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <CreateMaterialButton variantText="default" />
        <CreateWarehouseButton />
      </CardContent>
    </Card>
  );
}
