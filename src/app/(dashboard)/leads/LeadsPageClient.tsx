"use client";
import { type ReactElement, useCallback } from "react";
import { leadsColumns } from "../list/leads/leadsColumns";
import { CommercialTable } from "./table/CommercialTable";
import { CreateLeadForm } from "../list/leads/components/CreateLeadForm";
import { LeadWithRelations } from "./kanban/page";
import { ToastAlerts } from "@/components/ToastAlerts";
import { useAutoRefresh } from "@/hooks/useAutoRefresh"; // El hook que creamos arriba
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeadsPageClientProps {
  initialData: LeadWithRelations[];
  columns: typeof leadsColumns;
  generadores: any[];
  sectores: any[];
  origenes: any[];
  isAdmin: boolean;
  activeUser: { name: string; id: string };
}

export function LeadsPageClient({
  initialData,
  columns,
  generadores,
  sectores,
  origenes,
  isAdmin,
  activeUser,
}: LeadsPageClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh cada 30 segundos
  const { refreshData } = useAutoRefresh(5000);

  // Función para refrescar manualmente
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      // Esperar un poco para la animación
      setTimeout(() => setIsRefreshing(false), 1000);
    } catch (error) {
      setIsRefreshing(false);
    }
  }, [router]);

  // Callback cuando se crea un nuevo lead
  const handleLeadCreated = useCallback(() => {
    // Forzar actualización inmediata
    refreshData();
  }, [refreshData]);

  return (
    <>
      <ToastAlerts />

      {/* Header con botones de acción */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <CreateLeadForm
            isAdmin={isAdmin}
            activeUser={activeUser}
            sectores={sectores}
            generadores={generadores}
            origenes={origenes}
            onLeadCreated={handleLeadCreated}
          />

          <Button
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>

        {/* Indicador de última actualización */}
        <div className="text-sm text-muted-foreground">
          Actualización automática cada 30 segundos
        </div>
      </div>

      <CommercialTable
        columns={columns}
        data={initialData}
        generadores={generadores}
      />
    </>
  );
}
