"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Updated color scheme with blue tones
const COLORS = [
  "hsl(210, 100%, 50%)", // Bright blue
  "hsl(210, 100%, 60%)", // Light blue
  "hsl(210, 100%, 40%)", // Dark blue
  "hsl(210, 50%, 50%)", // Muted blue
  "hsl(210, 30%, 60%)", // Pale blue
  "hsl(210, 70%, 45%)", // Medium blue
];

export function CategoryDistribution() {
  const t = useTranslations("Dashboard.categoryDistribution");
  const distribution = useQuery(api.dashboard.getCategoryDistribution);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="hsl(210, 100%, 98%)" // Very light blue for contrast
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {distribution === undefined ? (
          <CategoryDistributionSkeleton />
        ) : distribution.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("noCategories")}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="hsl(210, 100%, 50%)" // Bright blue as default fill
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(210, 100%, 50%)", // Bright blue border
                  color: "hsl(210, 100%, 50%)", // Bright blue text
                }}
              />
              <Legend
                formatter={(value, entry, index) => (
                  <span style={{ color: COLORS[index % COLORS.length] }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryDistributionSkeleton() {
  return (
    <div className="flex justify-center items-center">
      <Skeleton className="h-[400px] w-full rounded" />
    </div>
  );
}
