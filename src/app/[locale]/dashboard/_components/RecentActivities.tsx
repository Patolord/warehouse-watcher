import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const recentActivities = [
  { id: 1, message: "New shipment of Product A received", time: "2 hours ago" },
  { id: 2, message: "Low stock alert for Product B", time: "4 hours ago" },
  {
    id: 3,
    message: "Inventory count completed for Warehouse 2",
    time: "1 day ago",
  },
  { id: 4, message: "New order #1234 processed", time: "1 day ago" },
  { id: 5, message: "Product C restocked", time: "2 days ago" },
];

export function RecentActivities() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-2">
              <div className="bg-primary rounded-full p-1">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.message}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
