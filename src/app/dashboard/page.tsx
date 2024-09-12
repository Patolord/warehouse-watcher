import { StatsCards } from "./_components/StatsCards";
import { InventoryTrends } from "./_components/InventoryTrends";
import { RecentActivities } from "./_components/RecentActivities";
import { StockLevels } from "./_components/StockLevels";
import { QuickActions } from "./_components/QuickActions";
import { CategoryDistribution } from "./_components/CategoryDistribution";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <StatsCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <InventoryTrends /> <RecentActivities />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <StockLevels />
        <QuickActions />
      </div>
      <CategoryDistribution />
    </div>
  );
}
