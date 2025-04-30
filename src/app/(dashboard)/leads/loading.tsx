import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header - Board Title and Controls Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <Skeleton className="h-9 w-64 rounded-md" />
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {/* Column 1 - To Do */}
        <div className="flex-shrink-0 w-72">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-6" />
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-3">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Column 2 - In Progress */}
        <div className="flex-shrink-0 w-72">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-6" />
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-3">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Column 3 - Done */}
        <div className="flex-shrink-0 w-72">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-5 w-6" />
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {Array(2)
                .fill()
                .map((_, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-3">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Column 4 - Backlog */}
        <div className="flex-shrink-0 w-72">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-6" />
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="mt-3">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Add Column Button */}
        <div className="flex-shrink-0 w-16 flex items-center">
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
