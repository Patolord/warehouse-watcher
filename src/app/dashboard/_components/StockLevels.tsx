"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../../convex/_generated/api";

export function StockLevels() {
  const stockLevels = useQuery(api.dashboard.getStockLevels);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Stock Levels</CardTitle>
      </CardHeader>
      <CardContent>
        {stockLevels === undefined ? (
          <StockLevelsSkeleton />
        ) : stockLevels.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No stock data available
          </p>
        ) : (
          <ul>
            {stockLevels.map((item) => (
              <li key={item.id}>
                {item.name}: {item.quantity} units
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function StockLevelsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
