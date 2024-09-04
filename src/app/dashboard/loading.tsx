import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[300px] lg:col-span-4" />
        <Skeleton className="h-[300px] lg:col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[250px] lg:col-span-4" />
        <Skeleton className="h-[250px] lg:col-span-3" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
