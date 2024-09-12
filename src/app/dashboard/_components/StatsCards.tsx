"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Package, Warehouse, ArrowRightLeft } from "lucide-react";

export function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Materials"
        value={stats?.totalMaterials}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Warehouses"
        value={stats?.totalWarehouses}
        icon={<Warehouse className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Transactions"
        value={stats?.totalTransactions}
        icon={<ArrowRightLeft className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Users"
        value={stats?.totalUsers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === undefined ? (
          <Skeleton className="h-7 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
