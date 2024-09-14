"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Warehouse } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export interface Activity {
  id: string;
  actionType: string;
  time: string | number;
  details?: {
    icon?: "warehouse" | "material";
  };
}

export function RecentActivities({ activities }: { activities: any }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities === undefined ? (
          <RecentActivitiesSkeleton />
        ) : activities.length === 0 ? (
          <p className="text-center text-muted-foreground">No activities</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity: Activity) => (
              <li key={activity.id} className="flex items-start space-x-2">
                <div className="bg-primary rounded-full p-1">
                  {activity.details?.icon === "warehouse" ? (
                    <Warehouse className="h-4 w-4 text-primary-foreground" />
                  ) : activity.details?.icon === "material" ? (
                    <Package className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Package className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.actionType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), {
                      addSuffix: true,
                      locale: enUS,
                    })}
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

function RecentActivitiesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-start space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
