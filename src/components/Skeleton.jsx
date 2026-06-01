const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
);

export const ProductGridSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div className="panel overflow-hidden" key={index}>
        <Skeleton className="aspect-[4/3] rounded-none" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
