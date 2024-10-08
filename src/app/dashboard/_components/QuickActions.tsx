"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateButton as CreateMaterialButton } from "../materials/_components/create-button";
import { CreateButton as CreateWarehouseButton } from "../warehouses/_components/create-button";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <CreateMaterialButton
          triggerButton={<Button className="">Create Material</Button>}
        />
        <CreateWarehouseButton
          triggerButton={<Button className="">Add Warehouse</Button>}
        />
      </CardContent>
    </Card>
  );
}
