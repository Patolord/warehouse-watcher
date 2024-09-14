"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
}

export function StockLevels({
  stockLevels,
}: {
  stockLevels: StockItem[] | undefined;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStockLevels = stockLevels?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stock Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stockLevels === undefined ? (
          <StockLevelsSkeleton />
        ) : stockLevels.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No stock data available
          </p>
        ) : (
          <>
            <Input
              type="search"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <ul className="space-y-2">
              {filteredStockLevels?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary"
                >
                  <span>{item.name}</span>
                  <Badge variant={getStockLevelVariant(item.quantity)}>
                    {item.quantity} units
                  </Badge>
                </li>
              ))}
            </ul>
          </>
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

// TODO: Implement color based on quantity
function getStockLevelVariant(
  quantity: number
): "outline" | "outline" | "outline" {
  if (quantity > 50) return "outline";
  if (quantity > 20) return "outline";
  return "outline";
}
