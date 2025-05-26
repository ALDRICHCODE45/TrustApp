"use client";
import { type ReactElement, useCallback } from "react";
import { leadsColumns } from "../list/leads/leadsColumns";
import { CommercialTable } from "./table/CommercialTable";
import { CreateLeadForm } from "../list/leads/components/CreateLeadForm";
import { LeadWithRelations } from "./kanban/page";
import { ToastAlerts } from "@/components/ToastAlerts";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

  // Callback cuando se crea un nuevo lead
  const handleLeadCreated = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <ToastAlerts />

      {/* Header con botones de acción */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Leads</h1>
        </div>

        <div className="flex items-center gap-2">
          <CreateLeadForm
            isAdmin={isAdmin}
            activeUser={activeUser}
            sectores={sectores}
            generadores={generadores}
            origenes={origenes}
          />
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
