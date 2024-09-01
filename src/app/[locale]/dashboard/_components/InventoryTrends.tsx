"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryTrends() {
  const t = useTranslations("Dashboard.inventoryTrends");
  const trends = useQuery(api.dashboard.getInventoryTrends);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {trends === undefined ? (
          <InventoryTrendsSkeleton />
        ) : trends.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("noTrendsAvailable")}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function InventoryTrendsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}
