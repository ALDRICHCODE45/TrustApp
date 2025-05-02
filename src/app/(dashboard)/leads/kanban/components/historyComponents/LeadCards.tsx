import { useMemo } from "react";
import { LeadStatus, User } from "@prisma/client";
import { LeadStatusRecord } from "../LeadHistory";
import { LeadCard } from "./LeadCard";

interface LeadCardsProps {
  filteredLeadHistory: LeadStatusRecord[];
}

export function LeadCards({ filteredLeadHistory }: LeadCardsProps) {
  // Agrupar leads por empresa para mejor visualización
  const groupedLeads = useMemo(() => {
    return filteredLeadHistory.reduce(
      (acc, item) => {
        if (!acc[item.leadId]) {
          acc[item.leadId] = {
            empresa: item.empresa,
            estados: [],
            generador: item.generador,
          };
        }

        acc[item.leadId].estados.push({
          status: item.status,
          date: new Date(item.statusDate),
          type: item.type,
          generador: item.generador,
        });

        // Ordenar por fecha
        acc[item.leadId].estados.sort(
          (a, b) => a.date.getTime() - b.date.getTime(),
        );

        return acc;
      },
      {} as Record<
        string,
        {
          empresa: string;
          estados: Array<{
            status: LeadStatus;
            date: Date;
            type: string;
            generador: User;
          }>;
          generador: User;
        }
      >,
    );
  }, [filteredLeadHistory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
      {Object.entries(groupedLeads).map(([leadId, lead]) => (
        <LeadCard key={leadId} leadId={leadId} lead={lead} />
      ))}
    </div>
  );
}
