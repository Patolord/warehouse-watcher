"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const inventoryTrends = [
  { date: "2023-01", total: 1000 },
  { date: "2023-02", total: 1200 },
  { date: "2023-03", total: 1100 },
  { date: "2023-04", total: 1300 },
  { date: "2023-05", total: 1500 },
];

export function InventoryTrends() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <div>Error loading inventory trends: {error.message}</div>;
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Inventory Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={inventoryTrends}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0066cc"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
