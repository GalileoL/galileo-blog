import Skeleton from "./Skeleton";

return (
  <div className={`bg-white shadow-md rounded-xl p-2 flex-1 ${className}`}>
    {/* toolbar */}
    <div className="flex items-center gap-2 mb-2">
      <Skeleton className="h-6 w-20 rounded" />
      <Skeleton className="h-6 w-24 rounded" />
      <Skeleton className="h-6 w-16 rounded" />
      <Skeleton className="h-6 w-10 rounded" />
      <Skeleton className="h-6 w-12 rounded" />
    </div>
    {/* content lines */}
    <div className="flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  </div>
);
