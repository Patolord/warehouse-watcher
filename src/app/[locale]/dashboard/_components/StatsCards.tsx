"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const t = useTranslations("Dashboard.statsCards");
  const stats = useQuery(api.dashboard.getStats);

  if (stats === undefined) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (Object.values(stats).every((value) => value === 0)) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t("noStatsAvailable")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title={t("totalMaterials")} value={stats.totalMaterials} />
      <StatCard title={t("totalWarehouses")} value={stats.totalWarehouses} />
      <StatCard
        title={t("totalTransactions")}
        value={stats.totalTransactions}
      />
      <StatCard title={t("totalUsers")} value={stats.totalUsers} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px]" />
      </CardContent>
    </Card>
  );
}
