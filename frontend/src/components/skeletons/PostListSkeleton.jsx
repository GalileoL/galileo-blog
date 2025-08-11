export default function PostSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3 py-4">
      <div className="h-5 w-1/2 bg-gray-800 rounded" />
      <div className="h-3 w-1/3 bg-gray-800 rounded" />
      <div className="h-3 w-2/3 bg-gray-800 rounded" />
    </div>
  );
}
