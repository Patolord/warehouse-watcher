export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-background animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 h-64 bg-gray-200 rounded-lg"></div>
        <div className="lg:col-span-3 h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 h-64 bg-gray-200 rounded-lg"></div>
        <div className="lg:col-span-3 h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  );
}
