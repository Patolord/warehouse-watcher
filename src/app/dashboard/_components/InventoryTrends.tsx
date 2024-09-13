"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryTrends({ trends }: { trends: any }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Inventory Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {trends === undefined ? (
          <InventoryTrendsSkeleton />
        ) : trends.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No trends available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
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
