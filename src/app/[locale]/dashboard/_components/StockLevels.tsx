"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function StockLevels() {
  const t = useTranslations("Dashboard.stockLevels");
  const stockLevels = useQuery(api.dashboard.getStockLevels);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {stockLevels === undefined ? (
          <StockLevelsSkeleton />
        ) : stockLevels.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("noStockData")}
          </p>
        ) : (
          <ul>
            {stockLevels.map((item) => (
              <li key={item.id}>
                {item.name}: {item.quantity} {t("units")}
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
