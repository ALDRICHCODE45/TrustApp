import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  // Crear arrays para simular múltiples columnas y tarjetas
  const columns = [1, 2, 3, 4]; // 4 columnas de estado
  const cardsPerColumn = [3, 2, 2, 1]; // Distribución de tarjetas por columna

  return (
    <div className="flex flex-col h-[calc(100vh-170px)]">
      {/* Filtros skeleton */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          {/* Search input skeleton */}
          <div className="relative">
            <Skeleton className="absolute left-2.5 top-2.5 h-4 w-4 rounded" />
            <Skeleton className="h-9 w-[200px] rounded" />
          </div>
          {/* Generator filter */}
          <Skeleton className="h-9 w-[200px] rounded" />
          {/* Office filter */}
          <Skeleton className="h-9 w-[180px] rounded" />
          {/* Date filter */}
          <Skeleton className="h-9 w-[240px] rounded" />
          {/* History drawer */}
          <Skeleton className="h-9 w-10 rounded" />
          {/* Clear filters button skeleton */}
          <Skeleton className="h-9 w-32 rounded" />
        </div>
      </div>

      {/* Filter badges skeleton */}
      <div className="px-4 py-2 flex flex-wrap gap-2 items-center">
        <Skeleton className="h-5 w-64 rounded" />
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="h-7 w-44 rounded-full" />
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex-1 overflow-x-auto p-4 h-[calc(80vh-140px)]">
        <div className="flex gap-14 h-full">
          {columns.map((column, columnIndex) => (
            <div
              key={column}
              className="w-[320px] flex-shrink-0 bg-[#f1f5f9] rounded-2xl p-3 h-full flex flex-col"
            >
              {/* Column header skeleton */}
              <div className="p-3 border border-slate-200 rounded-full bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                  <Skeleton className="h-6 w-8 rounded-full" />
                </div>
              </div>

              {/* Cards skeleton */}
              <div className="p-3 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {Array(cardsPerColumn[columnIndex])
                    .fill(0)
                    .map((_, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="p-3 bg-white border border-gray-200 rounded-2xl"
                      >
                        <div className="space-y-2">
                          {/* Badge skeleton */}
                          <Skeleton className="h-6 w-24 rounded-full" />

                          {/* Title and sector skeleton */}
                          <div className="flex items-start justify-between">
                            <div>
                              <Skeleton className="h-5 w-48 rounded mb-1" />
                              <Skeleton className="h-4 w-32 rounded" />
                            </div>
                          </div>

                          {/* Separator skeleton */}
                          <div className="pt-1 pb-1">
                            <Skeleton className="h-px w-full" />
                          </div>

                          {/* Footer with avatar and contacts skeleton */}
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <Skeleton className="h-8 w-8 rounded-full mr-2" />
                              <Skeleton className="h-4 w-20 rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-5 rounded" />
                              <Skeleton className="h-6 w-6 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
