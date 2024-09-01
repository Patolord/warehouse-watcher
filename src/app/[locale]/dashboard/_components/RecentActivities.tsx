"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { usePathname } from "next/navigation";

export function RecentActivities() {
  const t = useTranslations("Dashboard.recentActivities");
  const activities = useQuery(api.activities.getRecentActivities);
  const pathname = usePathname();
  const locale = pathname!.split("/")[1] as "pt" | "en";

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities === undefined ? (
          <RecentActivitiesSkeleton />
        ) : activities.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t("noActivities")}
          </p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start space-x-2">
                <div className="bg-primary rounded-full p-1">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(`actions.${activity.actionType}`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), {
                      addSuffix: true,
                      locale: locale === "pt" ? ptBR : enUS,
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
