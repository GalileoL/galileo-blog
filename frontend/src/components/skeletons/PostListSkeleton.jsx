import Skeleton from "./Skeleton";

export default function PostSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 py-4">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}
