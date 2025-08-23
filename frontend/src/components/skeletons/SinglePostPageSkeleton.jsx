// src/components/skeletons/PostPageSkeleton.jsx
import Skeleton from "./Skeleton";

export default function SinglePostPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* details */}
      <div className="flex gap-8">
        {/* left: title & meta */}
        <div className="lg:w-3/5 flex flex-col gap-6">
          {/* title */}
          <Skeleton className="h-8 md:h-10 xl:h-12 w-3/4" />
          {/* meta */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* desc */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* right: cover image */}
        <div className="hidden lg:block w-2/5">
          <Skeleton className="h-[412px] w-full rounded-2xl" />
        </div>
      </div>

      {/* content + sidebar */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* content text */}
        <div className="lg:text-lg flex-1 flex flex-col gap-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${i % 4 === 3 ? "w-3/4" : "w-full"}`}
            />
          ))}
        </div>

        {/* sidebar */}
        <div className="px-4 h-max sticky top-8 min-w-[240px] flex flex-col gap-4">
          <Skeleton className="h-5 w-24 mb-1" /> {/* Author */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-3 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          <Skeleton className="h-5 w-28 mt-6 mb-1" /> {/* Categories */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-24" />
          ))}
          <Skeleton className="h-5 w-20 mt-6" /> {/* Search */}
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>

      {/* comments */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
