import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="flex flex-col h-[calc(100vh-170px)]">
      {/* Filtros skeleton */}
      <div className="p-4 mt-10">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[200px] rounded-full animate-pulse" />
          <Skeleton className="h-10 w-[200px] rounded-full animate-pulse" />
          <Skeleton className="h-10 w-[200px] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex-1 overflow-x-auto p-4 ">
        <div className="flex gap-4 h-full">
          {[1, 2, 3, 4].map((column) => (
            <Skeleton
              key={column}
              className="w-[320px] h-[calc(100vh-300px)] flex-shrink-0 rounded-2xl animate-pulse "
            />
          ))}
        </div>
      </div>
    </div>
  );
}
