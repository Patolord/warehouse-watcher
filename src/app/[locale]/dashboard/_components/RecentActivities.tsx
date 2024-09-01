"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface Activity {
  id: string;
  actionType: string;
  time: string;
}

export function RecentActivities() {
  const t = useTranslations("Dashboard");
  const activities = useQuery(api.activities.getRecentActivities);

  if (activities === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p>No recent activities.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity: Activity) => (
              <li key={activity.id} className="flex items-start space-x-2">
                <div className="bg-primary rounded-full p-1">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(`actions.${activity.actionType}`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.time), "PPpp")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
