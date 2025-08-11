import Skeleton from "./Skeleton";

export default function FeaturePostsSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-8 lg:flex-row">
      {/* left big card */}
      <div className="flex w-full flex-col gap-4 lg:w-1/2">
        <Skeleton className="h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-3xl" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-8 w-5/6" />
      </div>

      {/* right three list items */}
      <div className="flex w-full flex-col gap-4 lg:w-1/2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 lg:h-1/3">
            <Skeleton className="w-1/3 aspect-video rounded-3xl" />
            <div className="w-2/3">
              <div className="mb-4 flex items-center gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
