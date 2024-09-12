"use client";

import { StatsCards } from "./_components/StatsCards";
import { RecentActivities } from "./_components/RecentActivities";
import { StockLevels } from "./_components/StockLevels";
import { QuickActions } from "./_components/QuickActions";
import { CategoryDistribution } from "./_components/CategoryDistribution";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { InventoryTrends } from "./_components/InventoryTrends";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Stats,
  StockLevel,
  Distribution,
  Trend,
  Activity,
} from "./_components/interfaces";

export default function Dashboard() {
  const stats: Stats | undefined = useQuery(api.dashboard.getStats);
  const stockLevels: StockLevel[] | undefined = useQuery(
    api.dashboard.getStockLevels
  );
  const distribution: Distribution[] | undefined = useQuery(
    api.dashboard.getCategoryDistribution
  );
  const trends: Trend[] | undefined = useQuery(
    api.dashboard.getInventoryTrends
  );
  const activities: Activity[] | undefined = useQuery(
    api.activities.getRecentActivities
  );

  if (
    stats === undefined ||
    stockLevels === undefined ||
    distribution === undefined ||
    trends === undefined ||
    activities === undefined
  ) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 bg-background">
      <StatsCards stats={stats} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <InventoryTrends trends={trends} />
        <RecentActivities activities={activities} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <StockLevels stockLevels={stockLevels} />
        <QuickActions />
      </div>
      <CategoryDistribution distribution={distribution} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[400px] lg:col-span-4" />
        <Skeleton className="h-[400px] lg:col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[300px] lg:col-span-4" />
        <Skeleton className="h-[300px] lg:col-span-3" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}
