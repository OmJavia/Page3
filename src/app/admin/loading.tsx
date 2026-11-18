export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Title & Filter Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-neutral-200 rounded-xl" />
          <div className="h-4 w-96 bg-neutral-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 bg-neutral-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-5 w-5 bg-neutral-100 rounded-full" />
            </div>
            <div className="h-8 w-32 bg-neutral-200 rounded-lg" />
            <div className="h-3 w-20 bg-neutral-100 rounded" />
          </div>
        ))}
      </div>

      {/* VIP Alert Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-neutral-200/60 border border-black/[0.06]" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-2xl bg-white border border-black/[0.06] p-6 space-y-4">
          <div className="h-6 w-48 bg-neutral-200 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-neutral-100" />
            ))}
          </div>
        </div>
        <div className="h-96 rounded-2xl bg-white border border-black/[0.06] p-6 space-y-4">
          <div className="h-6 w-36 bg-neutral-200 rounded-lg" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-neutral-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
