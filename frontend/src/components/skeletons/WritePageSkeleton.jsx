import Skeleton from "./Skeleton";
import ReactQuillSkeleton from "./ReactQuillSkeleton";

export default function WritePageSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:h-[calc(100vh-80px)]">
      <Skeleton className="h-8 w-60" /> {/* Create a new post */}
      <div className="flex flex-col gap-6 flex-1 mb-6">
        {/* cover upload button */}
        <Skeleton className="h-9 w-44 rounded-xl" />

        {/* (可选) 封面预览占位：保持布局不抖动 */}
        <Skeleton className="relative w-64 sm:w-72 md:w-80 lg:w-[28rem] aspect-video rounded-2xl" />

        {/* title */}
        <Skeleton className="h-10 w-3/4" />

        {/* category */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-40 rounded-xl" />
        </div>

        {/* desc textarea */}
        <div className="bg-white shadow-md rounded-xl p-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* editor row */}
        <div className="flex flex-1">
          {/* upload icons column */}
          <div className="flex flex-col gap-2 mr-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          {/* editor skeleton */}
          <ReactQuillSkeleton />
        </div>

        {/* submit */}
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
}
