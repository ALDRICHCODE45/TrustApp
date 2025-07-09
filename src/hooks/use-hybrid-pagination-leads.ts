import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { LeadStatus } from "@prisma/client";
import { LeadWithRelations } from "@/app/(dashboard)/leads/kanban/page";

interface HybridPaginationParams {
  pageSize?: number;
  prefetchSize?: number; // Cuántos registros cargar del servidor por vez
  status?: LeadStatus | "all";
  generadorId?: string;
  origenId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface HybridPaginationReturn {
  // Datos para mostrar en la página actual
  currentPageData: LeadWithRelations[];
  // Estado de carga
  loading: boolean;
  isFiltering: boolean; // Nuevo: loading específico para filtros
  error: string | null;
  // Paginación cliente (para la UI)
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalLocalRecords: number;
  // Paginación servidor (para pre-fetch)
  totalServerRecords: number;
  hasMoreInServer: boolean;
  // Controles
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  updateParams: (params: Partial<HybridPaginationParams>) => void;
  refetch: () => void;
  currentParams: HybridPaginationParams;
  // Nueva función para actualizar un lead específico
  updateLeadInState: (
    leadId: string,
    updates: Partial<LeadWithRelations>
  ) => void;
}

export function useHybridPaginationLeads(
  initialParams: HybridPaginationParams = {}
): HybridPaginationReturn {
  // Configuración
  const defaultPrefetchSize = 200; // Cargar 200 registros del servidor por vez
  const defaultPageSize = 10; // Mostrar 10 por página en UI

  // Estados
  const [allLoadedData, setAllLoadedData] = useState<LeadWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false); // Nuevo estado para filtros
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(
    initialParams.pageSize || defaultPageSize
  );
  const [serverPage, setServerPage] = useState(1); // Qué página del servidor hemos cargado
  const [totalServerRecords, setTotalServerRecords] = useState(0);
  const [hasMoreInServer, setHasMoreInServer] = useState(true);

  const [currentParams, setCurrentParams] = useState<HybridPaginationParams>({
    pageSize: defaultPageSize,
    prefetchSize: defaultPrefetchSize,
    status: "all",
    generadorId: "all",
    origenId: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  // Función para cargar datos del servidor
  const fetchFromServer = useCallback(
    async (
      params: HybridPaginationParams,
      serverPageToLoad: number = 1,
      append: boolean = false,
      isFilterOperation: boolean = false // Nuevo parámetro
    ) => {
      try {
        if (isFilterOperation) {
          setIsFiltering(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const searchParams = new URLSearchParams();

        // Usar prefetchSize para la paginación del servidor
        searchParams.append("page", serverPageToLoad.toString());
        searchParams.append(
          "pageSize",
          (params.prefetchSize || defaultPrefetchSize).toString()
        );

        // Filtros
        if (params.status && params.status !== "all") {
          searchParams.append("status", params.status);
        }
        if (params.generadorId && params.generadorId !== "all") {
          searchParams.append("generadorId", params.generadorId);
        }
        if (params.origenId && params.origenId !== "all") {
          searchParams.append("origenId", params.origenId);
        }
        if (params.search && params.search.trim()) {
          searchParams.append("search", params.search.trim());
        }
        if (params.dateFrom) {
          searchParams.append("dateFrom", params.dateFrom);
        }
        if (params.dateTo) {
          searchParams.append("dateTo", params.dateTo);
        }
        if (params.sortBy && params.sortBy !== "createdAt") {
          searchParams.append("sortBy", params.sortBy);
        }
        if (params.sortOrder && params.sortOrder !== "desc") {
          searchParams.append("sortOrder", params.sortOrder);
        }

        const url = `/api/leads?${searchParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (append) {
          // Agregar a los datos existentes (para pre-fetch)
          setAllLoadedData((prev) => [...prev, ...result.data]);
        } else {
          // Reemplazar datos (para nuevos filtros)
          setAllLoadedData(result.data);
          setCurrentPage(1); // Reset a primera página
        }

        setTotalServerRecords(result.pagination.totalCount);
        setHasMoreInServer(result.pagination.hasNextPage);
        setServerPage(serverPageToLoad);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar los datos";
        setError(errorMessage);
        toast.error(`Error al cargar leads: ${errorMessage}`);
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
        setIsFiltering(false);
      }
    },
    []
  );

  // Pre-fetch inteligente: cargar más datos cuando se acerque al final
  const checkAndPrefetch = useCallback(async () => {
    if (loading || !hasMoreInServer) return;

    const totalLocalPages = Math.ceil(allLoadedData.length / pageSize);
    const remainingPages = totalLocalPages - currentPage;

    // Si quedan menos de 3 páginas y hay más datos en el servidor, pre-cargar
    if (remainingPages <= 3 && hasMoreInServer) {
      console.log("🔄 Pre-cargando más datos...");
      await fetchFromServer(currentParams, serverPage + 1, true);
    }
  }, [
    loading,
    hasMoreInServer,
    allLoadedData.length,
    pageSize,
    currentPage,
    currentParams,
    serverPage,
    fetchFromServer,
  ]);

  // Datos para la página actual
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allLoadedData.slice(startIndex, endIndex);
  }, [allLoadedData, currentPage, pageSize]);

  // Cálculos de paginación
  const totalLocalRecords = allLoadedData.length;
  const totalPages = Math.ceil(totalLocalRecords / pageSize);

  // Función para ir a una página específica
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // Trigger pre-fetch check después de cambiar página
      setTimeout(checkAndPrefetch, 100);
    },
    [checkAndPrefetch]
  );

  // Función para cambiar tamaño de página
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset a primera página
    // Actualizar también en los parámetros
    setCurrentParams((prev) => ({ ...prev, pageSize: size }));
  }, []);

  // Función para actualizar parámetros (filtros, búsqueda, etc.)
  const updateParams = useCallback(
    (newParams: Partial<HybridPaginationParams>) => {
      setCurrentParams((prev) => {
        const updated = { ...prev, ...newParams };
        return updated;
      });
    },
    []
  );

  // Función para refrescar datos
  const refetch = useCallback(() => {
    setServerPage(1);
    setAllLoadedData([]);
    fetchFromServer(currentParams, 1, false);
  }, [fetchFromServer, currentParams]);

  // Efecto para cargar datos cuando cambien los parámetros
  useEffect(() => {
    // Reset todo cuando cambien filtros
    setServerPage(1);
    setAllLoadedData([]);
    setCurrentPage(1);
    fetchFromServer(currentParams, 1, false, true); // true = es operación de filtro
  }, [
    currentParams,
    currentParams.status,
    currentParams.generadorId,
    currentParams.origenId,
    currentParams.search,
    currentParams.dateFrom,
    currentParams.dateTo,
    currentParams.sortBy,
    currentParams.sortOrder,
    fetchFromServer,
  ]);

  // Efecto para check de pre-fetch cuando cambie la página actual
  useEffect(() => {
    checkAndPrefetch();
  }, [currentPage, checkAndPrefetch]);

  // Nueva función para actualizar un lead específico
  const updateLeadInState = useCallback(
    (leadId: string, updates: Partial<LeadWithRelations>) => {
      setAllLoadedData((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, ...updates } : lead
        )
      );
    },
    []
  );

  return {
    currentPageData,
    loading,
    isFiltering,
    error,
    currentPage,
    totalPages,
    pageSize,
    totalLocalRecords,
    totalServerRecords,
    hasMoreInServer,
    goToPage,
    setPageSize,
    updateParams,
    refetch,
    currentParams,
    updateLeadInState,
  };
}
