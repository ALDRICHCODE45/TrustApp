import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header - User Basic Info Skeleton */}
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar Section Skeleton */}
        <div className="lg:col-span-2 border rounded-lg p-4">
          <div className="pb-2">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        {/* Performance Tab Skeleton */}
        <div className="lg:col-span-3 border rounded-lg p-4">
          <div className="pb-2">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-6 mt-4">
            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg">
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              <div className="border rounded-lg">
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              <div className="border rounded-lg">
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
            {/* Performance Chart Skeleton */}
            <div className="border rounded-lg p-4">
              <Skeleton className="h-5 w-48 mb-4" />
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
