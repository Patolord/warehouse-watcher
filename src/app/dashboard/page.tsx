"use client";

import { StatsCards } from "./_components/StatsCards";
import { RecentActivities } from "./_components/RecentActivities";
import { StockLevels } from "./_components/StockLevels";
import { QuickActions } from "./_components/QuickActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Dashboard() {
  const stats = useQuery(api.dashboard.getStats);
  const stockLevels = useQuery(api.dashboard.getStockLevels);
  const activities = useQuery(api.activities.getRecentActivities);

  return (
    <div className="p-6 space-y-6 bg-background">
      {stats ? <StatsCards stats={stats} /> : <StatsCardsSkeleton />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        {activities ? (
          <RecentActivities activities={activities} />
        ) : (
          <RecentActivitiesSkeleton />
        )}
        {stockLevels ? (
          <StockLevels stockLevels={stockLevels} />
        ) : (
          <StockLevelsSkeleton />
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <QuickActions />
      </div>
    </div>
  );
}

// Skeleton Components
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}

function RecentActivitiesSkeleton() {
  return <Skeleton className="h-[400px] lg:col-span-3" />;
}

function StockLevelsSkeleton() {
  return <Skeleton className="h-[300px] lg:col-span-4" />;
}
