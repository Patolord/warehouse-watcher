import { Doc } from "../../../../../convex/_generated/dataModel";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WarehouseCard({
  warehouse,
}: {
  warehouse: Doc<"warehouses">;
}) {
  return (
    <Card key={warehouse._id}>
      <CardHeader>
        <CardTitle>{warehouse.name}</CardTitle>
        <CardDescription>{warehouse.address}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button variant="secondary" asChild className="flex items-center gap-2">
          <Link href={`/dashboard/warehouses/${warehouse._id}`}>
            View Inventory <ArrowBigRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
