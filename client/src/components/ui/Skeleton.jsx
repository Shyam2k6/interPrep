export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/3" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-[360px] flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3.5 w-1/4" />
      </div>
      <div className="flex-1 flex items-end gap-3 my-6 px-4">
        <Skeleton className="h-[20%] flex-1" />
        <Skeleton className="h-[50%] flex-1" />
        <Skeleton className="h-[30%] flex-1" />
        <Skeleton className="h-[80%] flex-1" />
        <Skeleton className="h-[45%] flex-1" />
        <Skeleton className="h-[60%] flex-1" />
        <Skeleton className="h-[90%] flex-1" />
      </div>
      <div className="pt-4 border-t border-slate-50 flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
