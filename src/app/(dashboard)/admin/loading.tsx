import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STATS ROW */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-400"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between flex-col md:flex-row">
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DONUT CHART - Employee Distribution */}
          <div className="md:col-span-1">
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <CardTitle className="text-base">
                      <Skeleton className="h-5 w-24" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-16" />
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-0 relative">
                <div className="mx-auto aspect-square max-h-[220px] flex items-center justify-center">
                  <Skeleton className="h-40 w-40 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-8 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* BAR CHART - Attendance Chart */}
          <div className="md:col-span-2">
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">
                      <Skeleton className="h-5 w-24" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-32" />
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[260px] flex items-center justify-center">
                  <Skeleton className="h-52 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LINE CHART - Finance Chart */}
          <div className="md:col-span-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">
                      <Skeleton className="h-5 w-20" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-4 w-28" />
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
          {/* Calendar */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <Skeleton className="h-5 w-24" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-36" />
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-center mb-4">
                <Skeleton className="h-52 w-64 rounded-md" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    <Skeleton className="h-5 w-28" />
                  </CardTitle>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="flex p-0 h-10">
                  <Skeleton className="h-4 w-16 mx-4" />
                  <Skeleton className="h-4 w-24 mx-4" />
                  <Skeleton className="h-4 w-16 mx-4" />
                </div>
              </div>
              <div className="h-48 w-full p-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="relative flex items-start space-x-3 rounded-lg p-2 transition-all mb-2 "
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1  rounded-l-md" />
                    <div className="flex-1 space-y-1 min-w-0 pl-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center whitespace-nowrap ml-2">
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                disabled
              >
                <Skeleton className="h-3 w-20" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                disabled
              >
                <Skeleton className="h-3 w-16" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
